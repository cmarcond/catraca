import { describe, it, expect } from 'vitest';
import { RequiredFieldValidation } from '../../../src/validation/validators/required-field-validation.js';
import { MissingParamError } from '../../../src/presentation/errors/missing-param-error.js';

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation('question');

describe('RequiredFieldValidation', () => {
  it('returns a MissingParamError when the field is absent', () => {
    const sut = makeSut();
    const error = sut.validate({ options: ['a', 'b'] });
    expect(error).toEqual(new MissingParamError('question'));
  });

  it('returns null when the field is present', () => {
    const sut = makeSut();
    const error = sut.validate({ question: 'any?' });
    expect(error).toBeNull();
  });

  it('returns a MissingParamError when the input itself is null', () => {
    const sut = makeSut();
    const error = sut.validate(null);
    expect(error).toEqual(new MissingParamError('question'));
  });
});
