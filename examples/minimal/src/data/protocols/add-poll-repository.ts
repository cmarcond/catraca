import type { Poll } from '../../domain/models/poll.js';

export interface AddPollRepository {
  add: (params: AddPollRepository.Params) => Promise<AddPollRepository.Result>;
}

export namespace AddPollRepository {
  export type Params = {
    question: string;
    options: string[];
  };
  export type Result = Poll;
}
