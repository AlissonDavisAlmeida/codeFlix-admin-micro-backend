import * as libClassValidator from "class-validator";
import { ClassValidator } from "../class-validator-field";

class StubClassValidator extends ClassValidator<{ field:string }> {
  validate(data: any): boolean {
    return super.validate(data);
  }
}

describe("ClassValidatorFields unit tests", () => {
  it("should initialize errors and validateData variables with null", () => {
    const validator = new StubClassValidator();

    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it("should validate with errors", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync").mockImplementation();
    spyValidateSync.mockReturnValue([{ property: "field", constraints: { required: "Value is required" } }]);

    const validator = new StubClassValidator();
    validator.validate({ field: undefined });

    expect(spyValidateSync).toHaveBeenCalledTimes(1);
    expect(validator.errors).not.toBeNull();
    expect(validator.errors).toStrictEqual({ field: ["Value is required"] });
    expect(validator.validatedData).toBeNull();
  });

  it("should validate without errors", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync").mockImplementation();
    spyValidateSync.mockReturnValue([]);

    const validator = new StubClassValidator();
    validator.validate({ field: "undefined" });

    expect(spyValidateSync).toHaveBeenCalledTimes(1);
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toStrictEqual({ field: "undefined" });
    expect(validator.validatedData).not.toBeNull();
  });
});
