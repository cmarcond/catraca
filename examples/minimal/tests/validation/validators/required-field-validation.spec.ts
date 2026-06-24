import { describe, it, expect } from 'vitest';
import { RequiredFieldValidation } from '../../../src/validation/validators/required-field-validation.js';
import { MissingParamError } from '../../../src/presentation/errors/missing-param-error.js';

const makeSut = (field = 'question'): RequiredFieldValidation =>
  new RequiredFieldValidation(field);

describe('RequiredFieldValidation', () => {
  it('returns a MissingParamError when the field is absent', () => {
    const sut = makeSut();
    expect(sut.validate({ options: ['a', 'b'] })).toEqual(
      new MissingParamError('question'),
    );
  });

  it('returns a MissingParamError when the field is an empty string', () => {
    const sut = makeSut();
    expect(sut.validate({ question: '' })).toEqual(
      new MissingParamError('question'),
    );
  });

  it('returns a MissingParamError when input is null', () => {
    const sut = makeSut();
    expect(sut.validate(null)).toEqual(new MissingParamError('question'));
  });

  it('returns null when the field is present and non-empty', () => {
    const sut = makeSut();
    expect(sut.validate({ question: 'Best language?' })).toBeNull();
  });
});
