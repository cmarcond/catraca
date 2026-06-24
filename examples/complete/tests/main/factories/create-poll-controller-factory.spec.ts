import { describe, it, expect } from 'vitest';
import { makeCreatePollController } from '../../../src/main/factories/create-poll-controller-factory.js';
import type { Poll } from '../../../src/domain/models/poll.js';

describe('CreatePollController factory (integration)', () => {
  it('builds a controller that returns 200 and persists a valid poll', async () => {
    const controller = makeCreatePollController();

    const response = await controller.handle({
      body: { question: 'Best language?', options: ['TypeScript', 'Rust'] },
    });

    expect(response.statusCode).toBe(200);
    const poll = response.body as Poll;
    expect(poll.id).toEqual(expect.any(String));
    expect(poll.id.length).toBeGreaterThan(0);
    expect(poll.question).toBe('Best language?');
    expect(poll.options).toEqual(['TypeScript', 'Rust']);
  });

  it('builds a controller that returns 400 when the question is missing', async () => {
    const controller = makeCreatePollController();

    const response = await controller.handle({
      body: { options: ['TypeScript', 'Rust'] },
    });

    expect(response.statusCode).toBe(400);
  });

  it('builds a controller that returns 400 when there are fewer than two options', async () => {
    const controller = makeCreatePollController();

    const response = await controller.handle({
      body: { question: 'Best language?', options: ['only-one'] },
    });

    expect(response.statusCode).toBe(400);
  });
});
