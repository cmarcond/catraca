import { Controller } from '../protocols/controller.js';
import { HttpRequest, HttpResponse } from '../protocols/http.js';
import { Validation } from '../protocols/validation.js';
import { CreatePoll } from '../../domain/usecases/create-poll.js';
import { ok, badRequest, serverError } from '../helpers/http-helper.js';

export class CreatePollController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createPoll: CreatePoll,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);
      if (error) {
        return badRequest(error);
      }
      const { question, options } = request.body as CreatePoll.Params;
      const poll = await this.createPoll.create({ question, options });
      return ok(poll);
    } catch {
      return serverError();
    }
  }
}
