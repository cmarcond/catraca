import { describe, it, expect } from 'vitest';
import { makeListPollsController } from '../../../src/main/factories/list-polls-controller-factory.js';
import type { Poll } from '../../../src/domain/models/poll.js';

describe('ListPollsController factory (integration)', () => {
  it('builds a controller that returns 200 and an empty list initially', async () => {
    const controller = makeListPollsController();

    const response = await controller.handle({ body: null });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('builds a controller backed by a real in-memory store', async () => {
    const controller = makeListPollsController();

    const response = await controller.handle({ body: null });

    expect(response.statusCode).toBe(200);
    const polls = response.body as Poll[];
    expect(Array.isArray(polls)).toBe(true);
  });
});
