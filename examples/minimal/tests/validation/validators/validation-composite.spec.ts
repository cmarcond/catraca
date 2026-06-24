import { describe, it, expect, vi } from 'vitest';
import { ValidationComposite } from '../../../src/validation/validators/validation-composite.js';
import { Validation } from '../../../src/presentation/protocols/validation.js';

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: Validation[];
};

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()];
  const sut = new ValidationComposite(validationStubs);
  return { sut, validationStubs };
};

describe('ValidationComposite', () => {
  it('returns the first validator error', () => {
    const { sut, validationStubs } = makeSut();
    vi.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
      new Error('first error'),
    );
    vi.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(
      new Error('second error'),
    );
    const error = sut.validate({});
    expect(error).toEqual(new Error('first error'));
  });

  it('returns null when no validator fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({});
    expect(error).toBeNull();
  });
});
