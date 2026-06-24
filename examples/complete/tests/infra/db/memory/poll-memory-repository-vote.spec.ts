import { describe, it, expect } from 'vitest';
import { PollMemoryRepository } from '../../../../src/infra/db/memory/poll-memory-repository.js';

const makeSut = (): PollMemoryRepository => new PollMemoryRepository();

describe('PollMemoryRepository (vote)', () => {
  it('loads a stored poll by its id', async () => {
    const sut = makeSut();
    const poll = await sut.add({ question: 'Q', options: ['a', 'b'] });

    const loaded = await sut.loadById(poll.id);

    expect(loaded).toEqual(poll);
  });

  it('returns null when no poll matches the id', async () => {
    const sut = makeSut();

    const loaded = await sut.loadById('missing');

    expect(loaded).toBeNull();
  });

  it('returns a copy so mutating the loaded poll does not affect the store', async () => {
    const sut = makeSut();
    const poll = await sut.add({ question: 'Q', options: ['a', 'b'] });

    const loaded = await sut.loadById(poll.id);
    loaded?.options.push('mutated');

    const fresh = await sut.loadById(poll.id);
    expect(fresh?.options).toEqual(['a', 'b']);
  });

  it('saves a vote with a generated id and stores it', async () => {
    const sut = makeSut();

    const vote = await sut.save({ pollId: 'poll-1', option: 'a' });

    expect(vote.id).toEqual(expect.any(String));
    expect(vote.id.length).toBeGreaterThan(0);
    expect(vote.pollId).toBe('poll-1');
    expect(vote.option).toBe('a');
    expect(sut.votes).toContainEqual(vote);
  });
});
