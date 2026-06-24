import type { Vote } from '../models/vote.js';

export interface CastVote {
  cast: (params: CastVote.Params) => Promise<CastVote.Result>;
}

export namespace CastVote {
  export type Params = {
    pollId: string;
    option: string;
  };

  export type Outcome = 'recorded' | 'poll-not-found' | 'invalid-option';

  export type Result =
    | { outcome: 'recorded'; vote: Vote }
    | { outcome: 'poll-not-found' }
    | { outcome: 'invalid-option' };
}
