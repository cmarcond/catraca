import { describe, it, expect } from 'vitest';
import { makeCreatePollController } from '../../../src/main/factories/create-poll-controller-factory.js';
import { CreatePollController } from '../../../src/presentation/controllers/create-poll-controller.js';
import { DbCreatePoll } from '../../../src/data/usecases/db-create-poll.js';
import { PollMemoryRepository } from '../../../src/infra/db/memory/poll-memory-repository.js';
import { makeCreatePollValidation } from '../../../src/main/factories/create-poll-validation-factory.js';

describe('makeCreatePollController (integration)', () => {
  it('returns 200 with a created poll for a valid request', async () => {
    const sut = makeCreatePollController();
    const response = await sut.handle({
      body: { question: 'Best language?', options: ['TS', 'Go'] },
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      question: 'Best language?',
      options: ['TS', 'Go'],
    });
    expect((response.body as { id: string }).id).toBeTypeOf('string');
  });

  it('returns 400 for a request that violates the real validation rules', async () => {
    const sut = makeCreatePollController();
    const response = await sut.handle({
      body: { question: 'Only one option', options: ['just one'] },
    });
    expect(response.statusCode).toBe(400);
  });

  it('persists the poll in the real in-memory repository', async () => {
    const repository = new PollMemoryRepository();
    const controller = new CreatePollController(
      makeCreatePollValidation(),
      new DbCreatePoll(repository),
    );
    const response = await controller.handle({
      body: { question: 'Best language?', options: ['TS', 'Go'] },
    });
    expect(response.statusCode).toBe(200);
    expect(repository.polls).toHaveLength(1);
    expect(repository.polls[0]).toEqual(response.body);
  });
});
