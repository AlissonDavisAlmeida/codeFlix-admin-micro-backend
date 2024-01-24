import { FieldsErrors } from "../shared/domain/validators/validators-fields.interface";

declare global {
    namespace jest {
        interface Matchers<R> {
            containsErrorMessage(expected: FieldsErrors): R;
        }
    }
}