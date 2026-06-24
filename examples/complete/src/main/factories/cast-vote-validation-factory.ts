import type { Validation } from '../../presentation/protocols/validation.js';
import { ValidationComposite } from '../../validation/validators/validation-composite.js';
import { RequiredFieldValidation } from '../../validation/validators/required-field-validation.js';

export const makeCastVoteValidation = (): Validation => {
  return new ValidationComposite([
    new RequiredFieldValidation('pollId'),
    new RequiredFieldValidation('option'),
  ]);
};
