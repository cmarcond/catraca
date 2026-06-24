import type { Controller } from '../../presentation/protocols/controller.js';
import { CastVoteController } from '../../presentation/controllers/cast-vote-controller.js';
import { DbCastVote } from '../../data/usecases/db-cast-vote.js';
import { PollMemoryRepository } from '../../infra/db/memory/poll-memory-repository.js';
import { makeCastVoteValidation } from './cast-vote-validation-factory.js';

export const makeCastVoteController = (repository: PollMemoryRepository): Controller => {
  const castVote = new DbCastVote(repository, repository);
  const validation = makeCastVoteValidation();
  return new CastVoteController(validation, castVote);
};
