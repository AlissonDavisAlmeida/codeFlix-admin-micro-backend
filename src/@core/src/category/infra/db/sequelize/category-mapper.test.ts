import { randomUUID } from "crypto";
import { LoadingEntityError } from "#seedwork/domain";
import { Category } from "#category/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { CategorySequelize } from "./category-sequelize";

describe("CategoryMapper unit tests", () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throws error when category is invalid", () => {
    const model = CategorySequelize.CategoryModel.build({
      id: randomUUID(),
    });

    try {
      CategorySequelize.CategoryMapper.toEntity(model);
      fail("The Category is valid but it should throws a LoadingEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadingEntityError);
      expect(e.errors).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],

      });
    }
  });

  it("should throws a generic error", () => {
    const error = new Error("Generic error");

    const spyValidator = jest.spyOn(Category, "validate").mockImplementation(() => {
      throw error;
    });

    const model = CategorySequelize.CategoryModel.build({ id: randomUUID() });

    try {
      CategorySequelize.CategoryMapper.toEntity(model);
      fail("The Category is valid but it should throws a generic error");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toEqual(error);
    } finally {
      expect(spyValidator).toHaveBeenCalledTimes(1);
    }
  });

  it("should convert a category model to a category entity", () => {
    const date = new Date();
    const model = CategorySequelize.CategoryModel.build({
      id: randomUUID(),
      name: "Category name",
      description: "Category description",
      is_active: true,
      created_at: date,
    });

    const entity = CategorySequelize.CategoryMapper.toEntity(model);

    expect(entity).toBeInstanceOf(Category);
    expect(entity.toJSON()).toStrictEqual(model.toJSON());
  });
});
