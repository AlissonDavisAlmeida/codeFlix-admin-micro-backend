import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { Notification, ToJsonError } from "../../domain/validators/notification";
import { EntityValidationError } from "../../domain/validators/validation.error";

type Expected = |
{
    validator: ClassValidatorFields,
    notification: Notification,
    data: any
    fields: string[]
}
    |

    (() => any)



expect.extend({
    containsErrorMessage(expected: Expected, received: ToJsonError) {
        if (typeof expected === "function") {
            try {
                expected();
                return isValid();
            } catch (err) {
                const error = err as EntityValidationError;
                return assertContainsErrorsMessages(error.errors, received);
            }
        } else {
            const { validator, data, fields, notification } = expected;
            const validated = validator.validate(notification, data, fields);

            if (validated) {
                return isValid();
            }

            return assertContainsErrorsMessages(notification.toJSON(), received);
        }
    }
});



function assertContainsErrorsMessages(expected: ToJsonError, received: ToJsonError) {
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