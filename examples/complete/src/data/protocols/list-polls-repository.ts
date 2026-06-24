import type { Poll } from '../../domain/models/poll.js';

export interface ListPollsRepository {
  list: () => Promise<ListPollsRepository.Result>;
}

export namespace ListPollsRepository {
  export type Result = Poll[];
}
