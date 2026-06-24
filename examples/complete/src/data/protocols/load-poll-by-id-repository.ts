import type { Poll } from '../../domain/models/poll.js';

export interface LoadPollByIdRepository {
  loadById: (id: string) => Promise<LoadPollByIdRepository.Result>;
}

export namespace LoadPollByIdRepository {
  export type Result = Poll | null;
}
