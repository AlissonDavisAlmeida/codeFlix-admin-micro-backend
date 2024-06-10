import { ToJsonError } from "../shared/domain/validators/notification";

declare global {
    namespace jest {
        interface Matchers<R> {
            containsErrorMessage(expected: ToJsonError): R;
        }
    }
}