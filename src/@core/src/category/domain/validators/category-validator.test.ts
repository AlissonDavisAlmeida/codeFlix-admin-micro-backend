import { CategoryRules, CategoryValidator, CategoryValidatorFactory } from "./category-validator";

describe("Category Validator tests", () => {
  let validator: CategoryValidator;

  beforeEach(() => {
    validator = CategoryValidatorFactory.create();
  });
  test("invalidation cases for name field", () => {
    let isValid = validator.validate(null);
    expect(isValid).toBeFalsy();
    expect(validator.errors["name"]).toStrictEqual(
      ["name should not be empty", "name must be a string", "name must be shorter than or equal to 255 characters"],
    );

    isValid = validator.validate({ name: "" });
    expect(isValid).toBeFalsy();
    expect(validator.errors["name"]).toStrictEqual(
      ["name should not be empty"],
    );

    isValid = validator.validate({ name: 5 as any });
    expect(isValid).toBeFalsy();
    expect(validator.errors["name"]).toStrictEqual(
      ["name must be a string", "name must be shorter than or equal to 255 characters"],
    );

    isValid = validator.validate({ name: "a".repeat(256) });
    expect(isValid).toBeFalsy();
    expect(validator.errors["name"]).toStrictEqual(
      ["name must be shorter than or equal to 255 characters"],
    );
  });

  test("validation cases for fields", () => {
    let isValid = validator.validate({ name: "name" });
    expect(isValid).toBeTruthy();
    expect(validator.validatedData).toStrictEqual(new CategoryRules({ name: "name" }));

    isValid = validator.validate({ name: "name", description: undefined });
    expect(isValid).toBeTruthy();
    expect(validator.validatedData).toStrictEqual(new CategoryRules({ name: "name", description: undefined }));

    isValid = validator.validate({ name: "name", description: null });
    expect(isValid).toBeTruthy();
    expect(validator.validatedData).toStrictEqual(new CategoryRules({ name: "name", description: null }));

    isValid = validator.validate({ name: "name", is_active: true });
    expect(isValid).toBeTruthy();
    expect(validator.validatedData).toStrictEqual(new CategoryRules({ name: "name", is_active: true }));

    isValid = validator.validate({ name: "name", is_active: false });
    expect(isValid).toBeTruthy();
    expect(validator.validatedData).toStrictEqual(new CategoryRules({ name: "name", is_active: false }));
  });
});
