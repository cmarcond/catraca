import { Validation } from '../../presentation/protocols/validation.js';
import { InvalidParamError } from '../../presentation/errors/invalid-param-error.js';

export class MinOptionsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly minimum: number,
  ) {}

  validate(input: unknown): Error | null {
    const record = (input ?? {}) as Record<string, unknown>;
    const value = record[this.fieldName];
    if (!Array.isArray(value) || value.length < this.minimum) {
      return new InvalidParamError(
        this.fieldName,
        `at least ${this.minimum} required`,
      );
    }
    return null;
  }
}
