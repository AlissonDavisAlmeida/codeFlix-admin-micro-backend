import { Sequelize } from "sequelize-typescript";
import { randomUUID } from "crypto";
import { CategoryMapper } from "./category-mapper";
import CategoryModel from "./category-model";
import { LoadingEntityError } from "#seedwork/domain";
import { Category } from "#category/domain";

describe("CategoryMapper unit tests", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      host: ":memory:",
      logging: false,
      models: [CategoryModel],
    });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should throws error when category is invalid", () => {
    const model = CategoryModel.build({
      id: randomUUID(),
    });

    try {
      CategoryMapper.toEntity(model);
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

    const model = CategoryModel.build({ id: randomUUID() });

    try {
      CategoryMapper.toEntity(model);
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
    const model = CategoryModel.build({
      id: randomUUID(),
      name: "Category name",
      description: "Category description",
      is_active: true,
      created_at: date,
    });

    const entity = CategoryMapper.toEntity(model);

    expect(entity).toBeInstanceOf(Category);
    expect(entity.toJSON()).toStrictEqual(model.toJSON());
  });
});
