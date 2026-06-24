import { describe, it, expect } from 'vitest';
import { PollMemoryRepository } from '../../../../src/infra/db/memory/poll-memory-repository.js';

const makeSut = (): PollMemoryRepository => new PollMemoryRepository();

describe('PollMemoryRepository', () => {
  it('stores and returns a poll with a generated id', async () => {
    const sut = makeSut();
    const poll = await sut.add({
      question: 'any question?',
      options: ['option a', 'option b'],
    });
    expect(poll.id).toBeTypeOf('string');
    expect(poll.id.length).toBeGreaterThan(0);
    expect(poll.question).toBe('any question?');
    expect(poll.options).toEqual(['option a', 'option b']);
  });

  it('persists each added poll in its store', async () => {
    const sut = makeSut();
    const poll = await sut.add({
      question: 'any question?',
      options: ['option a', 'option b'],
    });
    expect(sut.polls).toContainEqual(poll);
  });
});
