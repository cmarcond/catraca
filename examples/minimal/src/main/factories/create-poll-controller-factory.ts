import type { Controller } from '../../presentation/protocols/controller.js';
import { CreatePollController } from '../../presentation/controllers/create-poll-controller.js';
import { DbCreatePoll } from '../../data/usecases/db-create-poll.js';
import { PollMemoryRepository } from '../../infra/db/memory/poll-memory-repository.js';
import { makeCreatePollValidation } from './create-poll-validation-factory.js';

export const makeCreatePollController = (): Controller => {
  const repository = new PollMemoryRepository();
  const createPoll = new DbCreatePoll(repository);
  const validation = makeCreatePollValidation();
  return new CreatePollController(validation, createPoll);
};
