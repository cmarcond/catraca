import { describe, it, expect, vi } from 'vitest';
import { DbCreatePoll } from '../../../src/data/usecases/db-create-poll.js';
import type { AddPollRepository } from '../../../src/data/protocols/add-poll-repository.js';
import type { Poll } from '../../../src/domain/models/poll.js';

const makeFakeParams = (): { question: string; options: string[] } => ({
  question: 'Best language?',
  options: ['TypeScript', 'Rust'],
});

const makeFakePoll = (): Poll => ({
  id: 'any-id',
  question: 'Best language?',
  options: ['TypeScript', 'Rust'],
});

class AddPollRepositorySpy implements AddPollRepository {
  params?: AddPollRepository.Params;
  result: Poll = makeFakePoll();

  async add(params: AddPollRepository.Params): Promise<AddPollRepository.Result> {
    this.params = params;
    return this.result;
  }
}

const makeSut = (): { sut: DbCreatePoll; repository: AddPollRepositorySpy } => {
  const repository = new AddPollRepositorySpy();
  const sut = new DbCreatePoll(repository);
  return { sut, repository };
};

describe('DbCreatePoll', () => {
  it('calls AddPollRepository with the question and options', async () => {
    const { sut, repository } = makeSut();
    const addSpy = vi.spyOn(repository, 'add');

    await sut.create(makeFakeParams());

    expect(addSpy).toHaveBeenCalledWith({
      question: 'Best language?',
      options: ['TypeScript', 'Rust'],
    });
  });

  it('returns the poll created by the repository', async () => {
    const { sut, repository } = makeSut();
    repository.result = { id: 'poll-1', question: 'Q', options: ['a', 'b'] };

    const poll = await sut.create(makeFakeParams());

    expect(poll).toEqual({ id: 'poll-1', question: 'Q', options: ['a', 'b'] });
  });
});
