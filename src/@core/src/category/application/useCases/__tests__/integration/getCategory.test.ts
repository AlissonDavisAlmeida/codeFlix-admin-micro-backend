import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { GetCategory } from "../../getCategory";

describe("Get Category integration tests use case", () => {
  let useCase: GetCategory;
  let repository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({
    models: [CategorySequelize.CategoryModel],
  });

  beforeEach(() => {
    repository = new CategorySequelize.CategorySequelizeRepository(CategorySequelize.CategoryModel);
    useCase = new GetCategory(repository);
  });

  it("should throws an error if category not exists", async () => {
    await expect(async () => useCase.execute({ id: "fake-id" }))
      .rejects
      .toThrow(new NotFoundError("Entity not found using id: fake-id"));
  });

  it("should return a category", async () => {
    const model = await CategorySequelize.CategoryModel.factory().create();
    const category = await useCase.execute({ id: model.id });

    expect(category).toStrictEqual({
      id: model.id,
      name: model.name,
      description: model.description,
      created_at: model.created_at,
      is_active: model.is_active,
    });
  });
});
