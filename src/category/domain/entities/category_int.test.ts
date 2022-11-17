import { update } from "lodash";
import { ValidationError } from "../../../@seedwork/domain/errors/Validation-error";
import { Category } from "./Category";

describe("Category entity integration tests", () => {
  describe("Create a new Category", () => {
    it("should a invalid category when create", () => {
      // expect(() => new Category({ name: null })).toThrow(
      //   new ValidationError("name is required"),
      // );

      // expect(() => new Category({ name: "" })).toThrow(
      //   new ValidationError("name is required"),
      // );

      // expect(() => new Category({ name: "a".repeat(256) })).toThrow(
      //   new ValidationError("name is too long"),
      // );

      // expect(() => new Category({ name: 1 as any })).toThrow(
      //   new ValidationError("name is not a string"),
      // );
    });

    it("should a invalid category using description property", () => {
      // expect(() => new Category({ name: "name", description: 1 as any })).toThrow(
      //   new ValidationError("description is not a string"),
      // );
    });

    it("should a invalid category using is_active property", () => {
      // expect(() => new Category({ name: "name", is_active: 1 as any })).toThrow(
      //   new ValidationError("is_active is not a boolean"),
      // );
    });
  });

  describe("Update a Category", () => {
    it("should a invalid category when create", () => {
      const category = new Category({ name: "name" });
      // expect(() => category.update(null, null)).toThrow(
      //   new ValidationError("name is required"),
      // );

      // expect(() => category.update("", null)).toThrow(
      //   new ValidationError("name is required"),
      // );

      // expect(() => category.update("2".repeat(256), null)).toThrow(
      //   new ValidationError("name is too long"),
      // );

      // expect(() => category.update(1 as any, null)).toThrow(
      //   new ValidationError("name is not a string"),
      // );
    });

    it("should a invalid category using description property", () => {
      const category = new Category({ name: "name" });
      // expect(() => category.update("nome", 1 as any)).toThrow(
      //   new ValidationError("description is not a string"),
      // );
    });
  });
});
