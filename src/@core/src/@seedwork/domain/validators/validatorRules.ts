import { ValidationError } from "../errors/Validation-error";

export function isEmpty(value: any) {
  return value === null || value === undefined;
}

export class ValidatorRules {
  private constructor(private value: any, private property: string) { }

  static values(value: any, property: string) {
    return new ValidatorRules(value, property);
  }

  required(): Omit<this, "required"> {
    if (this.value === null || this.value === undefined || this.value === "") {
      throw new ValidationError(`${this.property} is required`);
    }
    return this;
  }

  string(): Omit<this, "string"> {
    if (!isEmpty(this.value) && typeof this.value !== "string") {
      throw new ValidationError(`${this.property} is not a string`);
    }
    return this;
  }

  maxLength(max = 5): Omit<this, "maxLength"> {
    if (!isEmpty(this.value) && this.value.length > max) {
      throw new ValidationError(`${this.property} is too long`);
    }
    return this;
  }

  boolean(): Omit<this, "boolean"> {
    if (!isEmpty(this.value) && typeof this.value !== "boolean") {
      throw new ValidationError(`${this.property} is not a boolean`);
    }
    return this;
  }
}
