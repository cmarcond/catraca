import type { Controller } from '../protocols/controller.js';
import type { HttpResponse } from '../protocols/http.js';
import type { ListPolls } from '../../domain/usecases/list-polls.js';
import { ok, serverError } from '../helpers/http-helper.js';

export class ListPollsController implements Controller {
  constructor(private readonly listPolls: ListPolls) {}

  async handle(): Promise<HttpResponse> {
    try {
      const polls = await this.listPolls.list();
      return ok(polls);
    } catch {
      return serverError();
    }
  }
}
