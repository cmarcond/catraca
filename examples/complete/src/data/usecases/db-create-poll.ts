import type { CreatePoll } from '../../domain/usecases/create-poll.js';
import type { AddPollRepository } from '../protocols/add-poll-repository.js';

export class DbCreatePoll implements CreatePoll {
  constructor(private readonly addPollRepository: AddPollRepository) {}

  async create(params: CreatePoll.Params): Promise<CreatePoll.Result> {
    return this.addPollRepository.add({
      question: params.question,
      options: params.options,
    });
  }
}
