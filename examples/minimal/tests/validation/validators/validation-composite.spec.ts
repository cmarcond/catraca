import { describe, it, expect } from 'vitest';
import { ValidationComposite } from '../../../src/validation/validators/validation-composite.js';
import type { Validation } from '../../../src/presentation/protocols/validation.js';

class ValidationStub implements Validation {
  constructor(private readonly error: Error | null) {}
  validate(): Error | null {
    return this.error;
  }
}

describe('ValidationComposite', () => {
  it('returns the first error when multiple validations fail', () => {
    const first = new Error('first');
    const second = new Error('second');
    const sut = new ValidationComposite([
      new ValidationStub(first),
      new ValidationStub(second),
    ]);

    expect(sut.validate({})).toBe(first);
  });

  it('returns null when all validations pass', () => {
    const sut = new ValidationComposite([
      new ValidationStub(null),
      new ValidationStub(null),
    ]);

    expect(sut.validate({})).toBeNull();
  });
});
