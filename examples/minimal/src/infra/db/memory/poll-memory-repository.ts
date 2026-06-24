import { randomUUID } from 'node:crypto';
import { AddPollRepository } from '../../../data/protocols/add-poll-repository.js';
import { Poll } from '../../../domain/models/poll.js';

export class PollMemoryRepository implements AddPollRepository {
  readonly polls: Poll[] = [];

  async add(data: AddPollRepository.Params): Promise<AddPollRepository.Result> {
    const poll: Poll = {
      id: randomUUID(),
      question: data.question,
      options: data.options,
    };
    this.polls.push(poll);
    return poll;
  }
}
