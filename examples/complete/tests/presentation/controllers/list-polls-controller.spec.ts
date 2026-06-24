import { describe, it, expect } from 'vitest';
import { ListPollsController } from '../../../src/presentation/controllers/list-polls-controller.js';
import type { ListPolls } from '../../../src/domain/usecases/list-polls.js';
import type { Poll } from '../../../src/domain/models/poll.js';

const makeFakePolls = (): Poll[] => [
  { id: 'poll-1', question: 'Best language?', options: ['TypeScript', 'Rust'] },
];

class ListPollsSpy implements ListPolls {
  result: Poll[] = makeFakePolls();

  async list(): Promise<ListPolls.Result> {
    return this.result;
  }
}

const makeSut = (): { sut: ListPollsController; listPolls: ListPollsSpy } => {
  const listPolls = new ListPollsSpy();
  const sut = new ListPollsController(listPolls);
  return { sut, listPolls };
};

describe('ListPollsController', () => {
  it('returns 200 and the list of polls', async () => {
    const { sut, listPolls } = makeSut();

    const response = await sut.handle();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(listPolls.result);
  });

  it('returns 200 and an empty list when there are no polls', async () => {
    const { sut, listPolls } = makeSut();
    listPolls.result = [];

    const response = await sut.handle();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('returns 500 when ListPolls throws', async () => {
    const { sut, listPolls } = makeSut();
    listPolls.list = async (): Promise<Poll[]> => {
      throw new Error('unexpected');
    };

    const response = await sut.handle();

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new Error('Internal server error'));
  });
});
