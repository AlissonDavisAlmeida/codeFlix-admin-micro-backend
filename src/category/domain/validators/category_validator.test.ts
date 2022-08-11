import { CategoryRules, CategoryValidator, CategoryValidatorFactory } from "./category_validator";

describe("Category Validator", () => {
  let validator: CategoryValidator;

  beforeEach(() => {
    validator = CategoryValidatorFactory.create();
  });

  it("invalidation cases for name field", () => {
    const isValid = validator.validate(null);

    expect({ validator, data: null }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    /*
    expect(isValid).toBe(false);
    expect(validator.errors["name"]).toStrictEqual([
      "name should not be empty",
      "name must be a string",
      "name must be shorter than or equal to 255 characters"]);

    isValid = validator.validate({ name: "" });

    expect(isValid).toBe(false);
    expect(validator.errors["name"]).toStrictEqual([
      "name should not be empty",
    ]);

    isValid = validator.validate({ name: 5 as any });

    expect(isValid).toBe(false);
    expect(validator.errors["name"]).toStrictEqual([
      "name must be a string",
      "name must be shorter than or equal to 255 characters",
    ]);

    isValid = validator.validate({ name: "t".repeat(257) });

    expect(isValid).toBe(false);
    expect(validator.errors["name"]).toStrictEqual([
      "name must be shorter than or equal to 255 characters",
    ]); */
  });

  it("valid cases for fields", () => {
    const arrange:any[] = [
      { name: "test" },
      { name: "test", description: undefined },
      { name: "test", description: null },
      { name: "test", isActive: true },
      { name: "test", isActive: false },
    ];

    arrange.forEach((data:any) => {
      const isValid = validator.validate(data);
      expect(isValid).toBe(true);
      expect(validator.validatedData).toStrictEqual(new CategoryRules(data));
    });
  });
});
