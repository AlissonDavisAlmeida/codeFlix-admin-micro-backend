import * as libClass from "class-validator";
import { ClassValidatorFields } from "../class-validator";

class StubClassValidator extends ClassValidatorFields<{ field: string }> {

}

describe("Class Validator unit tests", () => {
  it("should initialize errors and validatedData variables with null", () => {
    const validator = new StubClassValidator();

    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it("should validate with errors", () => {
    const mockValidateSync = jest.spyOn(libClass, "validateSync");

    mockValidateSync.mockReturnValueOnce([{ property: "field", constraints: { isRequired: "field is required" } }]);

    const validator = new StubClassValidator();

    expect(validator.validate({ field: "" })).toBeFalsy();
    expect(validator.errors).toEqual({ field: ["field is required"] });
    expect(validator.validatedData).toBeNull();
    expect(mockValidateSync).toHaveBeenCalledTimes(1);
    expect(mockValidateSync).toHaveBeenCalledWith({ field: "" });
  });

  it("should validate without errors", () => {
    const mockValidateSync = jest.spyOn(libClass, "validateSync");

    mockValidateSync.mockReturnValueOnce([]);

    const validator = new StubClassValidator();

    expect(validator.validate({ field: "Name" })).toBeTruthy();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toStrictEqual({ field: "Name" });
    expect(mockValidateSync).toHaveBeenCalledTimes(1);
  });
});
