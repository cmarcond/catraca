import { describe, it, expect, vi } from 'vitest';
import { DbCreatePoll } from '../../../src/data/usecases/db-create-poll.js';
import { AddPollRepository } from '../../../src/data/protocols/add-poll-repository.js';
import { Poll } from '../../../src/domain/models/poll.js';

const makePoll = (): Poll => ({
  id: 'any-id',
  question: 'any question?',
  options: ['option a', 'option b'],
});

const makeAddPollRepositoryStub = (): AddPollRepository => {
  class AddPollRepositoryStub implements AddPollRepository {
    async add(): Promise<AddPollRepository.Result> {
      return makePoll();
    }
  }
  return new AddPollRepositoryStub();
};

type SutTypes = {
  sut: DbCreatePoll;
  addPollRepositoryStub: AddPollRepository;
};

const makeSut = (): SutTypes => {
  const addPollRepositoryStub = makeAddPollRepositoryStub();
  const sut = new DbCreatePoll(addPollRepositoryStub);
  return { sut, addPollRepositoryStub };
};

describe('DbCreatePoll', () => {
  it('calls AddPollRepository with the right question and options', async () => {
    const { sut, addPollRepositoryStub } = makeSut();
    const addSpy = vi.spyOn(addPollRepositoryStub, 'add');
    await sut.create({
      question: 'any question?',
      options: ['option a', 'option b'],
    });
    expect(addSpy).toHaveBeenCalledWith({
      question: 'any question?',
      options: ['option a', 'option b'],
    });
  });

  it('returns the created poll on success', async () => {
    const { sut } = makeSut();
    const poll = await sut.create({
      question: 'any question?',
      options: ['option a', 'option b'],
    });
    expect(poll).toEqual(makePoll());
  });
});
