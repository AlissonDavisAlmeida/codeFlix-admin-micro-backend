import {
  IsNotEmpty, IsNumber, IsString, MaxLength,
} from "class-validator";
import { ClassValidator } from "../class-validator-field";

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
    name: string;

  @IsNumber()
  @IsNotEmpty()
    price: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

class StubClassValidator extends ClassValidator<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data));
  }
}

describe("ClassValidatorFields intregation tests", () => {
  it("should validate with errors", () => {
    const validator = new StubClassValidator();

    expect(validator.validate(null)).toBe(false);
    expect(validator.errors).not.toBeNull();
    expect(validator.errors).toStrictEqual({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
      price: [
        "price should not be empty",
        "price must be a number conforming to the specified constraints",
      ],
    });
  });

  it("should be valid", () => {
    const validator = new StubClassValidator();

    expect(validator.validate({ name: "some value", price: 5 })).toBe(true);
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toStrictEqual(new StubRules({ name: "some value", price: 5 }));
  });
});
