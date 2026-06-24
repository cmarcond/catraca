import { describe, it, expect } from 'vitest';
import { CreatePollController } from '../../../src/presentation/controllers/create-poll-controller.js';
import type { Validation } from '../../../src/presentation/protocols/validation.js';
import type { CreatePoll } from '../../../src/domain/usecases/create-poll.js';
import type { Poll } from '../../../src/domain/models/poll.js';
import { MissingParamError } from '../../../src/presentation/errors/missing-param-error.js';

const makeRequest = (): { body: { question: string; options: string[] } } => ({
  body: { question: 'Best language?', options: ['TypeScript', 'Rust'] },
});

class ValidationSpy implements Validation {
  input?: unknown;
  error: Error | null = null;

  validate(input: unknown): Error | null {
    this.input = input;
    return this.error;
  }
}

class CreatePollSpy implements CreatePoll {
  params?: CreatePoll.Params;
  result: Poll = { id: 'poll-1', question: 'Best language?', options: ['TypeScript', 'Rust'] };

  async create(params: CreatePoll.Params): Promise<CreatePoll.Result> {
    this.params = params;
    return this.result;
  }
}

const makeSut = (): {
  sut: CreatePollController;
  validation: ValidationSpy;
  createPoll: CreatePollSpy;
} => {
  const validation = new ValidationSpy();
  const createPoll = new CreatePollSpy();
  const sut = new CreatePollController(validation, createPoll);
  return { sut, validation, createPoll };
};

describe('CreatePollController', () => {
  it('returns 400 when validation fails', async () => {
    const { sut, validation } = makeSut();
    validation.error = new MissingParamError('question');

    const response = await sut.handle(makeRequest());

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError('question'));
  });

  it('returns 200 and the created poll on success', async () => {
    const { sut, createPoll } = makeSut();

    const response = await sut.handle(makeRequest());

    expect(createPoll.params).toEqual({
      question: 'Best language?',
      options: ['TypeScript', 'Rust'],
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 'poll-1',
      question: 'Best language?',
      options: ['TypeScript', 'Rust'],
    });
  });

  it('returns 500 when CreatePoll throws', async () => {
    const { sut, createPoll } = makeSut();
    createPoll.create = async (): Promise<Poll> => {
      throw new Error('unexpected');
    };

    const response = await sut.handle(makeRequest());

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new Error('Internal server error'));
  });
});
