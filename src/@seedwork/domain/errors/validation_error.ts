import { FieldsErrors } from "../validators/ValidatorFields_interface";

export class ValidatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidatorError";
  }
}

export class EntityValidationError extends Error {
  constructor(public error: FieldsErrors) {
    super("Entity validation error");
    this.name = "EntityValidationError";
  }
}
