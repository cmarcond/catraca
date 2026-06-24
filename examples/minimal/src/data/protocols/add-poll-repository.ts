import { Poll } from '../../domain/models/poll.js';

export interface AddPollRepository {
  add: (data: AddPollRepository.Params) => Promise<AddPollRepository.Result>;
}

export namespace AddPollRepository {
  export type Params = {
    question: string;
    options: string[];
  };
  export type Result = Poll;
}
