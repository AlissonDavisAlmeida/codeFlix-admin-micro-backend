/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation_error";
import { Category } from "./category";

describe("Integration tests Category", () => {
  describe("Create Category", () => {
    it("should a invalid category using field name", () => {
      expect(() => new Category({ name: null })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => new Category({ name: "" })).containsErrorMessages({
        name: [
          "name should not be empty",

        ],
      });

      expect(() => new Category({ name: 4 as any })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",

        ],
      });

      expect(() => new Category({ name: "a".repeat(500) })).containsErrorMessages({
        name: [

          "name must be shorter than or equal to 255 characters",

        ],
      });
    });

    it("should a invalid category using field description", () => {
      expect(() => new Category({ name: "name test", description: 4 as any }))
        .containsErrorMessages({
          description: [
            "description must be a string",
          ],
        });
    });

    it("should a invalid category using field isActive", () => {
      expect(() => new Category({ name: "name test", isActive: 4 as any }))
        .containsErrorMessages({
          isActive: [
            "isActive must be a boolean value",
          ],
        });
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
        .containsErrorMessages({
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        });

      expect(() => category.update({ name: "", description: null }))
        .containsErrorMessages({
          name: [
            "name should not be empty",
          ],
        });

      expect(() => category.update({ name: 5 as any, description: null }))
        .containsErrorMessages({
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        });

      expect(() => category.update({ name: "a".repeat(510), description: null }))
        .containsErrorMessages({
          name: [
            "name must be shorter than or equal to 255 characters",
          ],
        });

      expect(() => category.update({ name: "a".repeat(500), description: null }))
        .containsErrorMessages({
          name: [
            "name must be shorter than or equal to 255 characters",
          ],
        });
    });
  });
});
