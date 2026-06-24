import { describe, it, expect } from 'vitest';
import { CastVoteController } from '../../../src/presentation/controllers/cast-vote-controller.js';
import type { Validation } from '../../../src/presentation/protocols/validation.js';
import type { CastVote } from '../../../src/domain/usecases/cast-vote.js';
import { MissingParamError } from '../../../src/presentation/errors/missing-param-error.js';
import { NotFoundError } from '../../../src/presentation/errors/not-found-error.js';
import { InvalidParamError } from '../../../src/presentation/errors/invalid-param-error.js';

const makeRequest = (): { body: { pollId: string; option: string } } => ({
  body: { pollId: 'poll-1', option: 'TypeScript' },
});

class ValidationSpy implements Validation {
  input?: unknown;
  error: Error | null = null;

  validate(input: unknown): Error | null {
    this.input = input;
    return this.error;
  }
}

class CastVoteSpy implements CastVote {
  params?: CastVote.Params;
  result: CastVote.Result = {
    outcome: 'recorded',
    vote: { id: 'vote-1', pollId: 'poll-1', option: 'TypeScript' },
  };

  async cast(params: CastVote.Params): Promise<CastVote.Result> {
    this.params = params;
    return this.result;
  }
}

const makeSut = (): {
  sut: CastVoteController;
  validation: ValidationSpy;
  castVote: CastVoteSpy;
} => {
  const validation = new ValidationSpy();
  const castVote = new CastVoteSpy();
  const sut = new CastVoteController(validation, castVote);
  return { sut, validation, castVote };
};

describe('CastVoteController', () => {
  it('returns 400 when validation fails', async () => {
    const { sut, validation } = makeSut();
    validation.error = new MissingParamError('pollId');

    const response = await sut.handle(makeRequest());

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError('pollId'));
  });

  it('returns 200 and the recorded vote on success', async () => {
    const { sut, castVote } = makeSut();

    const response = await sut.handle(makeRequest());

    expect(castVote.params).toEqual({ pollId: 'poll-1', option: 'TypeScript' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: 'vote-1', pollId: 'poll-1', option: 'TypeScript' });
  });

  it('returns 404 when the poll does not exist', async () => {
    const { sut, castVote } = makeSut();
    castVote.result = { outcome: 'poll-not-found' };

    const response = await sut.handle(makeRequest());

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual(new NotFoundError('poll'));
  });

  it('returns 400 when the option is not part of the poll', async () => {
    const { sut, castVote } = makeSut();
    castVote.result = { outcome: 'invalid-option' };

    const response = await sut.handle(makeRequest());

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new InvalidParamError('option', 'not part of the poll'));
  });

  it('returns 500 when CastVote throws', async () => {
    const { sut, castVote } = makeSut();
    castVote.cast = async (): Promise<CastVote.Result> => {
      throw new Error('unexpected');
    };

    const response = await sut.handle(makeRequest());

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new Error('Internal server error'));
  });
});
