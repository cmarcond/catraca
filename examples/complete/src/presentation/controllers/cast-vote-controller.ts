import type { Controller } from '../protocols/controller.js';
import type { HttpRequest, HttpResponse } from '../protocols/http.js';
import type { Validation } from '../protocols/validation.js';
import type { CastVote } from '../../domain/usecases/cast-vote.js';
import { ok, badRequest, notFound, serverError } from '../helpers/http-helper.js';
import { NotFoundError } from '../errors/not-found-error.js';
import { InvalidParamError } from '../errors/invalid-param-error.js';

export class CastVoteController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly castVote: CastVote,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);
      if (error) {
        return badRequest(error);
      }
      const { pollId, option } = request.body as CastVote.Params;
      const result = await this.castVote.cast({ pollId, option });
      switch (result.outcome) {
        case 'poll-not-found':
          return notFound(new NotFoundError('poll'));
        case 'invalid-option':
          return badRequest(new InvalidParamError('option', 'not part of the poll'));
        case 'recorded':
          return ok(result.vote);
      }
    } catch {
      return serverError();
    }
  }
}
