import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { EntityValidationError } from "../../domain/validators/validation.error";
import { FieldsErrors } from "../../domain/validators/validators-fields.interface";

type Expected = |
{
    validator: ClassValidatorFields<any>,
    data: any
}
    |

    (() => any)



expect.extend({
    containsErrorMessage(expected: Expected, received: FieldsErrors) {
        if (typeof expected === "function") {
            try {
                expected();
                return isValid();
            } catch (err) {
                const error = err as EntityValidationError;
                return assertContainsErrorsMessages(error.errors, received);
            }
        } else {
            const { validator, data } = expected;

            const validated = validator.validate(data);

            if (validated) {
                return isValid();
            }

            return assertContainsErrorsMessages(validator.errors, received);
        }
    }
});



function assertContainsErrorsMessages(expected: FieldsErrors, received: FieldsErrors) {
    const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

    if (isMatch) {
        return isValid();
    }

    return {
        message: () => `expected ${JSON.stringify(expected)} to contain ${JSON.stringify(received)}`,
        pass: false,
    };
}


function isValid() {
    return {
        message: () => "",
        pass: true,
    };
}