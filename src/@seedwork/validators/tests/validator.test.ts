import { ValidatorRules } from "../validatorRules";

function assertIsInvalid({
  value, property, rule, error,
}: { value: any, property: any, rule: keyof ValidatorRules, error: any }) {
  expect(() => {
    ValidatorRules.values(value, property)[rule]();
  }).toThrow(error);
}
describe("ValidatorRules unit tests", () => {
  test("values method", () => {
    const validator = ValidatorRules.values("test", "test");
    expect(validator).toBeDefined();
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("test");
    expect(validator["property"]).toBe("test");
  });
  test("required validation rules", () => {
    let validator = ValidatorRules.values(null, "test");
    expect(() => validator.required()).toThrowError("test is required");

    validator = ValidatorRules.values(undefined, "test");
    expect(() => validator.required()).toThrowError("test is required");

    validator = ValidatorRules.values("", "test");
    expect(() => validator.required()).toThrowError("test is required");

    validator = ValidatorRules.values("test", "test");
    expect(() => validator.required()).not.toThrow();

    validator = ValidatorRules.values(0, "test");
    expect(() => validator.required()).not.toThrow();

    validator = ValidatorRules.values(false, "test");
    expect(() => validator.required()).not.toThrow();
  });
  test("string validation rules", () => {
    let validator = ValidatorRules.values(null, "test");
    expect(() => validator.string()).not.toThrow("test is not a string");

    validator = ValidatorRules.values(undefined, "test");
    expect(() => validator.string()).not.toThrow();

    validator = ValidatorRules.values("", "test");
    expect(() => validator.string()).not.toThrow();

    validator = ValidatorRules.values("test", "test");
    expect(() => validator.string()).not.toThrow();

    validator = ValidatorRules.values(0, "test");
    expect(() => validator.string()).toThrowError("test is not a string");

    validator = ValidatorRules.values(false, "test");
    expect(() => validator.string()).toThrowError("test is not a string");
  });
  test("maxLength validation rules", () => {
    let validator = ValidatorRules.values(null, "test");
    expect(() => validator.maxLength(5)).not.toThrow();

    validator = ValidatorRules.values(undefined, "test");
    expect(() => validator.maxLength(5)).not.toThrow();

    validator = ValidatorRules.values("", "test");
    expect(() => validator.maxLength(5)).not.toThrow();

    validator = ValidatorRules.values("test", "test");
    expect(() => validator.maxLength(5)).not.toThrow();

    validator = ValidatorRules.values(0, "test");
    expect(() => validator.maxLength(5)).not.toThrow();

    validator = ValidatorRules.values(false, "test");
    expect(() => validator.maxLength(5)).not.toThrow();

    validator = ValidatorRules.values("test", "test");
    expect(() => validator.maxLength(3)).toThrow();

    validator = ValidatorRules.values("test", "test");
    expect(() => validator.maxLength(5)).not.toThrow();
  });

  test("boolean validation rules", () => {
    let validator = ValidatorRules.values(null, "test");
    expect(() => validator.boolean()).not.toThrowError("test is not a boolean");

    validator = ValidatorRules.values(undefined, "test");
    expect(() => validator.boolean()).not.toThrowError("test is not a boolean");

    validator = ValidatorRules.values("", "test");
    expect(() => validator.boolean()).toThrowError("test is not a boolean");

    validator = ValidatorRules.values("test", "test");
    expect(() => validator.boolean()).toThrowError("test is not a boolean");

    validator = ValidatorRules.values(0, "test");
    expect(() => validator.boolean()).toThrowError("test is not a boolean");

    validator = ValidatorRules.values(false, "test");
    expect(() => validator.boolean()).not.toThrow();
  });

  it("should throw a validation error then combine two or more validation rules", () => {
    expect(() => ValidatorRules.values(null, "field").required().string()).toThrowError("field is required");
    expect(() => ValidatorRules.values(5, "field").string().required()).toThrowError("field is not a string");
  });
});
