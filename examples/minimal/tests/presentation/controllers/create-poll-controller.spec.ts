import { describe, it, expect, vi } from 'vitest';
import { CreatePollController } from '../../../src/presentation/controllers/create-poll-controller.js';
import { Validation } from '../../../src/presentation/protocols/validation.js';
import { HttpRequest } from '../../../src/presentation/protocols/http.js';
import { CreatePoll } from '../../../src/domain/usecases/create-poll.js';
import { Poll } from '../../../src/domain/models/poll.js';
import { MissingParamError } from '../../../src/presentation/errors/missing-param-error.js';

const makeRequest = (): HttpRequest => ({
  body: {
    question: 'any question?',
    options: ['option a', 'option b'],
  },
});

const makePoll = (): Poll => ({
  id: 'any-id',
  question: 'any question?',
  options: ['option a', 'option b'],
});

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeCreatePollStub = (): CreatePoll => {
  class CreatePollStub implements CreatePoll {
    async create(): Promise<CreatePoll.Result> {
      return makePoll();
    }
  }
  return new CreatePollStub();
};

type SutTypes = {
  sut: CreatePollController;
  validationStub: Validation;
  createPollStub: CreatePoll;
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub();
  const createPollStub = makeCreatePollStub();
  const sut = new CreatePollController(validationStub, createPollStub);
  return { sut, validationStub, createPollStub };
};

describe('CreatePollController', () => {
  it('returns 400 when Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(
      new MissingParamError('question'),
    );
    const response = await sut.handle(makeRequest());
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('Missing param: question');
  });

  it('returns 200 with the created poll on success', async () => {
    const { sut } = makeSut();
    const response = await sut.handle(makeRequest());
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(makePoll());
  });

  it('returns 500 when CreatePoll throws', async () => {
    const { sut, createPollStub } = makeSut();
    vi.spyOn(createPollStub, 'create').mockRejectedValueOnce(
      new Error('unexpected'),
    );
    const response = await sut.handle(makeRequest());
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('Internal server error');
  });
});
