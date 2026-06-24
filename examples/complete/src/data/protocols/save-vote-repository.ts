import type { Vote } from '../../domain/models/vote.js';

export interface SaveVoteRepository {
  save: (params: SaveVoteRepository.Params) => Promise<SaveVoteRepository.Result>;
}

export namespace SaveVoteRepository {
  export type Params = {
    pollId: string;
    option: string;
  };
  export type Result = Vote;
}
