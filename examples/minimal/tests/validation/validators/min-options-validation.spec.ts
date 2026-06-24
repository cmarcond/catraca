import { describe, it, expect } from 'vitest';
import { MinOptionsValidation } from '../../../src/validation/validators/min-options-validation.js';
import { InvalidParamError } from '../../../src/presentation/errors/invalid-param-error.js';

const makeSut = (field = 'options', min = 2): MinOptionsValidation =>
  new MinOptionsValidation(field, min);

describe('MinOptionsValidation', () => {
  it('returns an InvalidParamError when there are fewer than the minimum options', () => {
    const sut = makeSut();
    expect(sut.validate({ options: ['only-one'] })).toEqual(
      new InvalidParamError('options', 'at least 2 options are required'),
    );
  });

  it('returns an InvalidParamError when the field is not an array', () => {
    const sut = makeSut();
    expect(sut.validate({ options: 'not-an-array' })).toEqual(
      new InvalidParamError('options', 'at least 2 options are required'),
    );
  });

  it('returns an InvalidParamError when input is null', () => {
    const sut = makeSut();
    expect(sut.validate(null)).toEqual(
      new InvalidParamError('options', 'at least 2 options are required'),
    );
  });

  it('returns null when there are at least the minimum options', () => {
    const sut = makeSut();
    expect(sut.validate({ options: ['a', 'b'] })).toBeNull();
  });
});
