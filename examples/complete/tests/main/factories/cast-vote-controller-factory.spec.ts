import { describe, it, expect } from 'vitest';
import { makeCastVoteController } from '../../../src/main/factories/cast-vote-controller-factory.js';
import { PollMemoryRepository } from '../../../src/infra/db/memory/poll-memory-repository.js';
import type { Vote } from '../../../src/domain/models/vote.js';

const makeContext = async (): Promise<{
  controller: ReturnType<typeof makeCastVoteController>;
  pollId: string;
}> => {
  const repository = new PollMemoryRepository();
  const poll = await repository.add({
    question: 'Best language?',
    options: ['TypeScript', 'Rust'],
  });
  return { controller: makeCastVoteController(repository), pollId: poll.id };
};

describe('CastVoteController factory (integration)', () => {
  it('records a vote for an existing poll and valid option', async () => {
    const { controller, pollId } = await makeContext();

    const response = await controller.handle({ body: { pollId, option: 'TypeScript' } });

    expect(response.statusCode).toBe(200);
    const vote = response.body as Vote;
    expect(vote.id).toEqual(expect.any(String));
    expect(vote.pollId).toBe(pollId);
    expect(vote.option).toBe('TypeScript');
  });

  it('returns 404 for a poll that does not exist', async () => {
    const { controller } = await makeContext();

    const response = await controller.handle({ body: { pollId: 'missing', option: 'TypeScript' } });

    expect(response.statusCode).toBe(404);
  });

  it('returns 400 for an option that is not part of the poll', async () => {
    const { controller, pollId } = await makeContext();

    const response = await controller.handle({ body: { pollId, option: 'Go' } });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 when a required field is missing', async () => {
    const { controller } = await makeContext();

    const response = await controller.handle({ body: { pollId: '' } });

    expect(response.statusCode).toBe(400);
  });
});
