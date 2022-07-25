import { ValidatorError } from "../errors/validation_error";

export class ValidatorRules {
  private value: any;

  private fieldName: string;

  private constructor(value: any, fieldName: string) {
    this.value = value;
    this.fieldName = fieldName;
  }

  static validate(value: any, fieldName: string): ValidatorRules {
    return new ValidatorRules(value, fieldName);
  }

  required(): ValidatorRules {
    if (this.value === undefined || this.value === null || this.value === "") {
      throw new ValidatorError("Value is required");
    }

    return this;
  }

  minLength(minLength: number): ValidatorRules {
    if (this.value.length < minLength) {
      throw new ValidatorError(`Value must be at least ${minLength} characters long`);
    }

    return this;
  }

  maxLength(maxLength: number): ValidatorRules {
    if (this.value.length > maxLength) {
      throw new ValidatorError(`Value must be at most ${maxLength} characters long`);
    }

    return this;
  }

  string(): ValidatorRules {
    if (typeof this.value !== "string") {
      throw new ValidatorError("Value must be a string");
    }

    return this;
  }
}
