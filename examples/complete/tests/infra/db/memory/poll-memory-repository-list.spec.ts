import { describe, it, expect } from 'vitest';
import { PollMemoryRepository } from '../../../../src/infra/db/memory/poll-memory-repository.js';

const makeSut = (): PollMemoryRepository => new PollMemoryRepository();

describe('PollMemoryRepository (list)', () => {
  it('returns an empty list when no poll was stored', async () => {
    const sut = makeSut();

    const polls = await sut.list();

    expect(polls).toEqual([]);
  });

  it('returns every stored poll with its question and options', async () => {
    const sut = makeSut();
    const first = await sut.add({ question: 'A', options: ['x', 'y'] });
    const second = await sut.add({ question: 'B', options: ['p', 'q'] });

    const polls = await sut.list();

    expect(polls).toHaveLength(2);
    expect(polls).toContainEqual(first);
    expect(polls).toContainEqual(second);
  });

  it('returns copies so mutating the result does not affect the store', async () => {
    const sut = makeSut();
    await sut.add({ question: 'A', options: ['x', 'y'] });

    const polls = await sut.list();
    const firstPoll = polls[0];
    if (firstPoll) {
      firstPoll.options.push('mutated');
    }

    const fresh = await sut.list();
    expect(fresh[0]?.options).toEqual(['x', 'y']);
  });
});
