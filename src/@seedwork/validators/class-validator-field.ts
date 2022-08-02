import { validateSync } from "class-validator";
import { FieldsErrors, ValidatorFieldsInterface } from "./ValidatorFields_interface";

export class ClassValidator<PropsValidated> implements ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErrors = null;

  validatedData: PropsValidated = null;

  validate(data: any): boolean {
    const errors = validateSync(data);

    if (errors.length > 0) {
      this.errors = {};

      errors.forEach((error) => {
        if (!this.errors[error.property]) {
          this.errors[error.property] = [];
        }

        this.errors[error.property].push(error.constraints[Object.keys(error.constraints)[0]]);
      });
    } else {
      this.errors = null;
      this.validatedData = data;
    }

    return !errors.length;
  }
}
