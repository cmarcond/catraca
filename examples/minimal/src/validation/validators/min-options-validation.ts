import type { Validation } from '../../presentation/protocols/validation.js';
import { InvalidParamError } from '../../presentation/errors/invalid-param-error.js';

export class MinOptionsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly min: number,
  ) {}

  validate(input: unknown): Error | null {
    const value =
      typeof input === 'object' && input !== null
        ? (input as Record<string, unknown>)[this.fieldName]
        : undefined;
    if (!Array.isArray(value) || value.length < this.min) {
      return new InvalidParamError(
        this.fieldName,
        `at least ${this.min} options are required`,
      );
    }
    return null;
  }
}
