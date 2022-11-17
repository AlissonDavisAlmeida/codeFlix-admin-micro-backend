import { expect } from "expect";
import { EntityValidationError } from "../errors/Validation-error";
import { ClassValidatorFields } from "../validators/class-validator";
import { FieldsErrors } from "../validators/validatorFieldsInterface";

type Expected = { validator: ClassValidatorFields<any>, data: any } | (() => any);

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return {
          pass: false,
          message: () => "Expected function to throw an error",
        };
      } catch (err) {
        const er = err as EntityValidationError;
        const isMatch = expect.objectContaining(received).asymmetricMatch(er.error);

        return isMatch ? { pass: true, message: () => "pass" } : {
          pass: false,
          message: () => `
          expected ${JSON.stringify(er.error)} to be invalid with errors ${JSON.stringify(received)}
      `,
        };
      }
    } else {
      const { validator, data } = expected;
      const isValid = validator.validate(data);

      if (isValid) {
        return {
          message: () => `expected ${JSON.stringify(data)} to be invalid`,
          pass: false,
        };
      }

      const isMatch = expect.objectContaining(received).asymmetricMatch(validator.errors);

      return isMatch ? { pass: true, message: () => "pass" } : {
        pass: false,
        message: () => `
          expected ${JSON.stringify(data)} to be invalid with errors ${JSON.stringify(received)}
      `,
      };
    }
  },
});

function Valid() {
  return { pass: true, message: () => "pass" };
}
