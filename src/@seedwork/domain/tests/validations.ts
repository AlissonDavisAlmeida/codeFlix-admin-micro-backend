// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from "expect";
import { EntityValidationError } from "../errors/validation_error";
import { ClassValidator } from "../validators/class-validator-field";
import { FieldsErrors } from "../validators/ValidatorFields_interface";

type Expected = { validator: ClassValidator<any>, data: any } | (() => void);

function isValid() {
  return { pass: true, message: () => "" };
}

function assertContainsErrors(received: FieldsErrors, expected: FieldsErrors) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

  return isMatch ? { pass: true, message: () => "" } : {
    pass: false,
    message: () => `The validation errors not contains ${JSON.stringify(received)} 
                                                                          Current: ${JSON.stringify(expected)}`,
  };
}

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return {
          pass: false,
          message: () => "The data is valid",
        };
      } catch (e) {
        const error = e as EntityValidationError;

        return assertContainsErrors(received, error.error);
      }
    } else {
      const isVal = expected.validator.validate(expected.data);

      if (isVal) {
        return isValid();
      }

      return assertContainsErrors(received, expected.validator.errors);
    }
  },

});
