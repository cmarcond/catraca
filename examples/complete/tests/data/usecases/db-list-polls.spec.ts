import { describe, it, expect, vi } from 'vitest';
import { DbListPolls } from '../../../src/data/usecases/db-list-polls.js';
import type { ListPollsRepository } from '../../../src/data/protocols/list-polls-repository.js';
import type { Poll } from '../../../src/domain/models/poll.js';

const makeFakePolls = (): Poll[] => [
  { id: 'poll-1', question: 'Best language?', options: ['TypeScript', 'Rust'] },
  { id: 'poll-2', question: 'Best editor?', options: ['Vim', 'VS Code'] },
];

class ListPollsRepositorySpy implements ListPollsRepository {
  result: Poll[] = makeFakePolls();

  async list(): Promise<ListPollsRepository.Result> {
    return this.result;
  }
}

const makeSut = (): { sut: DbListPolls; repository: ListPollsRepositorySpy } => {
  const repository = new ListPollsRepositorySpy();
  const sut = new DbListPolls(repository);
  return { sut, repository };
};

describe('DbListPolls', () => {
  it('returns the polls provided by the repository', async () => {
    const { sut, repository } = makeSut();

    const polls = await sut.list();

    expect(polls).toEqual(repository.result);
  });

  it('returns an empty list when the repository has none', async () => {
    const { sut, repository } = makeSut();
    repository.result = [];

    const polls = await sut.list();

    expect(polls).toEqual([]);
  });

  it('delegates to ListPollsRepository', async () => {
    const { sut, repository } = makeSut();
    const listSpy = vi.spyOn(repository, 'list');

    await sut.list();

    expect(listSpy).toHaveBeenCalledOnce();
  });
});
