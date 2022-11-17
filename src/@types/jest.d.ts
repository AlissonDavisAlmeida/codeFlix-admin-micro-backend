import { FieldsErrors } from "@seedwork/domain/validators/validatorFieldsInterface";

declare global {
  declare namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsErrors) => R;
    }
  }
}
