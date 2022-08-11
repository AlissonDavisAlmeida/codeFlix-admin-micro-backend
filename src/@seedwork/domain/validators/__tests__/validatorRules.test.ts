import { ValidatorRules } from "../ValidatorRules";

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

  it.each`
  value | typeValidator | message | params
  ${"10"} | ${"string"} | ${"Value must be a string"} | ${undefined}
  ${"true"} | ${"string"} | ${"Value must be a string"} | ${undefined}
  ${"name"} | ${"string"} | ${"Value must be a string"} | ${undefined}
  ${""} | ${"string"} | ${"Value must be a string"} | ${undefined}
  ${"named"} | ${"minLength"} | ${"Value must be at least 5 characters long"} | ${5}
  ${"nameField"} | ${"minLength"} | ${"Value must be at least 5 characters long"} | ${5}
  ${"sssssss"} | ${"maxLength"} | ${"Value must be at most 10 characters long"} | ${10}
  ${"nameField"} | ${"maxLength"} | ${"Value must be at most 10 characters long"} | ${10}
  ${true} | ${"boolean"} | ${"Value must be a boolean"} | ${undefined}
  ${false} | ${"boolean"} | ${"Value must be a boolean"} | ${undefined}
  `("should validate a field as valid value", ({
    value, typeValidator, message, params,
  }) => {
    const validator = ValidatorRules.validate(value, "fieldName");
    // @ts-ignore
    expect(() => validator[typeValidator](params || null)).not.toThrowError(message);
  });

  it.each`
  value
  ${"10"}
  ${undefined}
  ${null}
  ${1}
  ${true}
  ${"na"}
  ${"sssssssssssss"}
  
  `("should throw validation error when combine two or more validations rules", ({ value }) => {
    const validator = ValidatorRules.validate(value, "fieldName");
    expect(() => validator.required().string().minLength(5).maxLength(10)).toThrowError();
  });

  it.each`
    value
    ${"10qqq"}
    ${"undefined"}
  `("should not throw validation error when combine two or more validations rules", ({ value }) => {
    const validator = ValidatorRules.validate(value, "fieldName");
    expect(() => validator.required().string().minLength(5).maxLength(10)).not.toThrowError();
  });
});
