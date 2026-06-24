import type { Controller } from '../../presentation/protocols/controller.js';
import { ListPollsController } from '../../presentation/controllers/list-polls-controller.js';
import { DbListPolls } from '../../data/usecases/db-list-polls.js';
import { PollMemoryRepository } from '../../infra/db/memory/poll-memory-repository.js';

export const makeListPollsController = (): Controller => {
  const repository = new PollMemoryRepository();
  const listPolls = new DbListPolls(repository);
  return new ListPollsController(listPolls);
};
