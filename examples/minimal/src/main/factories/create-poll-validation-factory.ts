import { Validation } from '../../presentation/protocols/validation.js';
import { ValidationComposite } from '../../validation/validators/validation-composite.js';
import { RequiredFieldValidation } from '../../validation/validators/required-field-validation.js';
import { MinOptionsValidation } from '../../validation/validators/min-options-validation.js';

export const makeCreatePollValidation = (): Validation => {
  return new ValidationComposite([
    new RequiredFieldValidation('question'),
    new MinOptionsValidation('options', 2),
  ]);
};
