// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from "expect";
import { ClassValidator } from "../validators/class-validator-field";
import { FieldsErrors } from "../validators/ValidatorFields_interface";

type Expected = { validator: ClassValidator<any>, data: any };

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    const isValid = expected.validator.validate(expected.data);

    if (isValid) {
      return {
        pass: false,
        message: () => "The data is valid",
      };
    }

    const isMatch = expect.objectContaining(received).asymmetricMatch(expected.validator.errors);

    return isMatch ? { pass: true, message: () => "" } : {
      pass: false,
      message: () => `The validation errors not contains ${JSON.stringify(received)} 
                                                                        Current: ${JSON.stringify(expected.validator.errors)}`,
    };
  },

});
