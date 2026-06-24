import type { Validation } from '../../presentation/protocols/validation.js';
import { MissingParamError } from '../../presentation/errors/missing-param-error.js';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(input: unknown): Error | null {
    const value =
      typeof input === 'object' && input !== null
        ? (input as Record<string, unknown>)[this.fieldName]
        : undefined;
    if (value === undefined || value === null || value === '') {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
