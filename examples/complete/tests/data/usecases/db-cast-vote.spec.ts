import { describe, it, expect, vi } from 'vitest';
import { DbCastVote } from '../../../src/data/usecases/db-cast-vote.js';
import type { LoadPollByIdRepository } from '../../../src/data/protocols/load-poll-by-id-repository.js';
import type { SaveVoteRepository } from '../../../src/data/protocols/save-vote-repository.js';
import type { Poll } from '../../../src/domain/models/poll.js';
import type { Vote } from '../../../src/domain/models/vote.js';

const makeFakePoll = (): Poll => ({
  id: 'poll-1',
  question: 'Best language?',
  options: ['TypeScript', 'Rust'],
});

class LoadPollByIdRepositorySpy implements LoadPollByIdRepository {
  id?: string;
  result: Poll | null = makeFakePoll();

  async loadById(id: string): Promise<LoadPollByIdRepository.Result> {
    this.id = id;
    return this.result;
  }
}

class SaveVoteRepositorySpy implements SaveVoteRepository {
  params?: SaveVoteRepository.Params;
  result: Vote = { id: 'vote-1', pollId: 'poll-1', option: 'TypeScript' };

  async save(params: SaveVoteRepository.Params): Promise<SaveVoteRepository.Result> {
    this.params = params;
    return this.result;
  }
}

const makeSut = (): {
  sut: DbCastVote;
  loadPollByIdRepository: LoadPollByIdRepositorySpy;
  saveVoteRepository: SaveVoteRepositorySpy;
} => {
  const loadPollByIdRepository = new LoadPollByIdRepositorySpy();
  const saveVoteRepository = new SaveVoteRepositorySpy();
  const sut = new DbCastVote(loadPollByIdRepository, saveVoteRepository);
  return { sut, loadPollByIdRepository, saveVoteRepository };
};

describe('DbCastVote', () => {
  it('loads the poll by id', async () => {
    const { sut, loadPollByIdRepository } = makeSut();

    await sut.cast({ pollId: 'poll-1', option: 'TypeScript' });

    expect(loadPollByIdRepository.id).toBe('poll-1');
  });

  it('records the vote when the poll and option are valid', async () => {
    const { sut, saveVoteRepository } = makeSut();
    const saveSpy = vi.spyOn(saveVoteRepository, 'save');

    const result = await sut.cast({ pollId: 'poll-1', option: 'TypeScript' });

    expect(saveSpy).toHaveBeenCalledWith({ pollId: 'poll-1', option: 'TypeScript' });
    expect(result).toEqual({ outcome: 'recorded', vote: saveVoteRepository.result });
  });

  it('returns poll-not-found when the poll does not exist', async () => {
    const { sut, loadPollByIdRepository, saveVoteRepository } = makeSut();
    loadPollByIdRepository.result = null;
    const saveSpy = vi.spyOn(saveVoteRepository, 'save');

    const result = await sut.cast({ pollId: 'missing', option: 'TypeScript' });

    expect(result).toEqual({ outcome: 'poll-not-found' });
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('returns invalid-option when the option is not part of the poll', async () => {
    const { sut, saveVoteRepository } = makeSut();
    const saveSpy = vi.spyOn(saveVoteRepository, 'save');

    const result = await sut.cast({ pollId: 'poll-1', option: 'Go' });

    expect(result).toEqual({ outcome: 'invalid-option' });
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('propagates an unexpected error from the save repository', async () => {
    const { sut, saveVoteRepository } = makeSut();
    saveVoteRepository.save = async (): Promise<Vote> => {
      throw new Error('unexpected');
    };

    await expect(sut.cast({ pollId: 'poll-1', option: 'TypeScript' })).rejects.toThrow('unexpected');
  });
});
