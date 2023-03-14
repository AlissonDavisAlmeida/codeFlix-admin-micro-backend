import { FieldsErrors } from "../validators/validatorFieldsInterface";

export class LoadingEntityError extends Error {
  constructor(public errors: FieldsErrors, message?: string) {
    super(message ?? "Error loading entity");
    this.name = "LoadingEntityError";
  }
}
