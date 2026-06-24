import { describe, it, expect } from 'vitest';
import { MinOptionsValidation } from '../../../src/validation/validators/min-options-validation.js';
import { InvalidParamError } from '../../../src/presentation/errors/invalid-param-error.js';

const makeSut = (): MinOptionsValidation =>
  new MinOptionsValidation('options', 2);

describe('MinOptionsValidation', () => {
  it('returns an InvalidParamError when there are fewer than the minimum', () => {
    const sut = makeSut();
    const error = sut.validate({ options: ['only one'] });
    expect(error).toEqual(
      new InvalidParamError('options', 'at least 2 required'),
    );
  });

  it('returns an InvalidParamError when the field is not an array', () => {
    const sut = makeSut();
    const error = sut.validate({ options: 'not-an-array' });
    expect(error).toEqual(
      new InvalidParamError('options', 'at least 2 required'),
    );
  });

  it('returns null when the minimum is met', () => {
    const sut = makeSut();
    const error = sut.validate({ options: ['a', 'b'] });
    expect(error).toBeNull();
  });

  it('returns an InvalidParamError when the input itself is null', () => {
    const sut = makeSut();
    const error = sut.validate(null);
    expect(error).toEqual(
      new InvalidParamError('options', 'at least 2 required'),
    );
  });
});
