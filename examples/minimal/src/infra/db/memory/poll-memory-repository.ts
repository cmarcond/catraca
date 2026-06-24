import { randomUUID } from 'node:crypto';
import type { AddPollRepository } from '../../../data/protocols/add-poll-repository.js';
import type { Poll } from '../../../domain/models/poll.js';

export class PollMemoryRepository implements AddPollRepository {
  readonly polls: Poll[] = [];

  async add(params: AddPollRepository.Params): Promise<AddPollRepository.Result> {
    const poll: Poll = {
      id: randomUUID(),
      question: params.question,
      options: [...params.options],
    };
    this.polls.push(poll);
    return poll;
  }
}
