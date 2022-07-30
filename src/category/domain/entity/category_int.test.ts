/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidatorError } from "../../../@seedwork/errors/validation_error";
import { Category } from "./category";

describe("Integration tests Category", () => {
  describe("Create Category", () => {
    it("should a invalid category using field name", () => {
      expect(() => new Category({ name: null })).toThrowError(new ValidatorError("Value is required"));

      expect(() => new Category({ name: "" })).toThrowError(new ValidatorError("Value is required"));

      expect(() => new Category({ name: 4 as any })).toThrowError(new ValidatorError("Value must be a string"));

      expect(() => new Category({ name: "a".repeat(51) })).toThrowError(new ValidatorError("Value must be at most 50 characters long"));

      expect(() => new Category({ name: "a".repeat(5) })).toThrowError(new ValidatorError("Value must be at least 6 characters long"));
    });

    it("should a invalid category using field description", () => {
      expect(() => new Category({ name: "name test", description: 4 as any })).toThrowError(new ValidatorError("Value must be a string"));
    });

    it("should a invalid category using field isActive", () => {
      expect(() => new Category({ name: "name test", description: "some description", isActive: 4 as any }))
        .toThrowError(new ValidatorError("Value must be a boolean"));
    });

    it("should a valid category", () => {
      expect.assertions(0);
      let category = new Category({ name: "Movies" });
      category = new Category({ name: "Movies", description: "some description" });
      category = new Category({ name: "Movies", description: "some description", isActive: false });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      category = new Category({
        name: "Movies", description: "some description", isActive: false, createdAt: new Date(),
      });
    });
  });

  describe("Update Category", () => {
    it("should a invalid category using field name", () => {
      const category = new Category({ name: "name test" });

      expect(() => category.update({ name: null, description: null }))
        .toThrowError(new ValidatorError("Value is required"));

      expect(() => category.update({ name: "", description: null }))
        .toThrowError(new ValidatorError("Value is required"));

      expect(() => category.update({ name: 5 as any, description: null }))
        .toThrowError(new ValidatorError("Value must be a string"));

      expect(() => category.update({ name: "a".repeat(51), description: null }))
        .toThrowError(new ValidatorError("Value must be at most 50 characters long"));

      expect(() => category.update({ name: "a".repeat(5), description: null }))
        .toThrowError(new ValidatorError("Value must be at least 6 characters long"));
    });

    it("should a invalid category using field description", () => {
      const category = new Category({ name: "name test", description: "some description" });
      expect(() => category.update({ name: "name test", description: 4 as any }))
        .toThrowError(new ValidatorError("Value must be a string"));
    });
  });
});
