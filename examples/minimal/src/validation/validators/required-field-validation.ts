import { Validation } from '../../presentation/protocols/validation.js';
import { MissingParamError } from '../../presentation/errors/missing-param-error.js';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(input: unknown): Error | null {
    const record = (input ?? {}) as Record<string, unknown>;
    if (record[this.fieldName] === undefined || record[this.fieldName] === null) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
