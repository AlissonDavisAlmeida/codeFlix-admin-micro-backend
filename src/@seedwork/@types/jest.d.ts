import { FieldsErrors } from "@seedwork/domain/validators/ValidatorFields_interface";

declare global {
  namespace jest{
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsErrors) => R
    }
  }
}

export {};
