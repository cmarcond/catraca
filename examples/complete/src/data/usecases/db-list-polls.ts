import type { ListPolls } from '../../domain/usecases/list-polls.js';
import type { ListPollsRepository } from '../protocols/list-polls-repository.js';

export class DbListPolls implements ListPolls {
  constructor(private readonly listPollsRepository: ListPollsRepository) {}

  async list(): Promise<ListPolls.Result> {
    return this.listPollsRepository.list();
  }
}
