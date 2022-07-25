import { ValidatorRules } from "./ValidatorRules";

describe("ValidatorRules", () => {
  it.each`
    value | field 
    ${undefined} | ${"field"} 
    ${null} | ${"field"} 
    ${""} | ${"field"} 
  `("should return a error when field is missing", ({ value, field }) => {
    const validator = ValidatorRules.validate(value, field);
    expect(() => validator.required()).toThrowError("Value is required");
  });

  it.each`
    value | field
    ${10} | ${"field"}
    ${true} | ${"field"}
    ${"name"} | ${"field"}
    `("should not return a error when field is defined", ({ value, field }) => {
    const validator = ValidatorRules.validate(value, field);
    expect(() => validator.required()).not.toThrowError("Value is required");
  });

  it("should validate a field as a string", () => {
    let validator = ValidatorRules.validate(1, "fieldName");

    expect(() => validator.string()).toThrowError("Value must be a string");

    validator = ValidatorRules.validate("name", "fieldName");

    expect(() => validator.string()).not.toThrowError("Value must be a string");
  });

  it("should validate a field as a minimum length", () => {
    let validator = ValidatorRules.validate("name", "fieldName");

    expect(() => validator.minLength(5)).toThrowError("Value must be at least 5 characters long");

    validator = ValidatorRules.validate("nameField", "fieldName");

    expect(() => validator.minLength(5)).not.toThrowError("Value must be at least 5 characters long");
  });

  it("should validate a field as a maximum length", () => {
    let validator = ValidatorRules.validate("name12", "fieldName");

    expect(() => validator.maxLength(5)).toThrowError("Value must be at most 5 characters long");

    validator = ValidatorRules.validate("name", "fieldName");

    expect(() => validator.maxLength(5)).not.toThrowError("Value must be at most 5 characters long");
  });
});
