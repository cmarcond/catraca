import type { Poll } from '../models/poll.js';

export interface ListPolls {
  list: () => Promise<ListPolls.Result>;
}

export namespace ListPolls {
  export type Result = Poll[];
}
