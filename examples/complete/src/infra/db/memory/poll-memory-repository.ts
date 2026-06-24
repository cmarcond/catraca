import { randomUUID } from 'node:crypto';
import type { AddPollRepository } from '../../../data/protocols/add-poll-repository.js';
import type { ListPollsRepository } from '../../../data/protocols/list-polls-repository.js';
import type { LoadPollByIdRepository } from '../../../data/protocols/load-poll-by-id-repository.js';
import type { SaveVoteRepository } from '../../../data/protocols/save-vote-repository.js';
import type { Poll } from '../../../domain/models/poll.js';
import type { Vote } from '../../../domain/models/vote.js';

export class PollMemoryRepository
  implements AddPollRepository, ListPollsRepository, LoadPollByIdRepository, SaveVoteRepository
{
  readonly polls: Poll[] = [];
  readonly votes: Vote[] = [];

  async add(params: AddPollRepository.Params): Promise<AddPollRepository.Result> {
    const poll: Poll = {
      id: randomUUID(),
      question: params.question,
      options: [...params.options],
    };
    this.polls.push(poll);
    return poll;
  }

  async list(): Promise<ListPollsRepository.Result> {
    return this.polls.map((poll) => ({
      ...poll,
      options: [...poll.options],
    }));
  }

  async loadById(id: string): Promise<LoadPollByIdRepository.Result> {
    const poll = this.polls.find((candidate) => candidate.id === id);
    if (!poll) {
      return null;
    }
    return { ...poll, options: [...poll.options] };
  }

  async save(params: SaveVoteRepository.Params): Promise<SaveVoteRepository.Result> {
    const vote: Vote = {
      id: randomUUID(),
      pollId: params.pollId,
      option: params.option,
    };
    this.votes.push(vote);
    return vote;
  }
}
