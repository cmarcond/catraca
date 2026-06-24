import { describe, it, expect } from 'vitest';
import { PollMemoryRepository } from '../../../../src/infra/db/memory/poll-memory-repository.js';

const makeSut = (): PollMemoryRepository => new PollMemoryRepository();

describe('PollMemoryRepository', () => {
  it('persists the poll and returns it with a generated id', async () => {
    const sut = makeSut();

    const poll = await sut.add({
      question: 'Best language?',
      options: ['TypeScript', 'Rust'],
    });

    expect(poll.id).toEqual(expect.any(String));
    expect(poll.id.length).toBeGreaterThan(0);
    expect(poll.question).toBe('Best language?');
    expect(poll.options).toEqual(['TypeScript', 'Rust']);
    expect(sut.polls).toContainEqual(poll);
  });

  it('generates a distinct id for each stored poll', async () => {
    const sut = makeSut();

    const first = await sut.add({ question: 'A', options: ['x', 'y'] });
    const second = await sut.add({ question: 'B', options: ['x', 'y'] });

    expect(first.id).not.toBe(second.id);
    expect(sut.polls).toHaveLength(2);
  });
});
