import { Poll } from '../models/poll.js';

export interface CreatePoll {
  create: (params: CreatePoll.Params) => Promise<CreatePoll.Result>;
}

export namespace CreatePoll {
  export type Params = {
    question: string;
    options: string[];
  };
  export type Result = Poll;
}
