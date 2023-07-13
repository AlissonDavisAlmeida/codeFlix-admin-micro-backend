import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { DeleteCategory } from "../../deleteCategory";

describe("Delete Category integration tests use case", () => {
  let useCase: DeleteCategory;
  let repository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({
    models: [CategorySequelize.CategoryModel],
  });

  beforeEach(() => {
    repository = new CategorySequelize.CategorySequelizeRepository(CategorySequelize.CategoryModel);
    useCase = new DeleteCategory(repository);
  });

  it("should throws an error if category not exists", async () => {
    await expect(async () => useCase.execute({ id: "fake-id" }))
      .rejects
      .toThrow(new NotFoundError("Entity not found using id: fake-id"));
  });

  it("should delete a category", async () => {
    const categoryModel = CategorySequelize.CategoryModel.factory().create();

    await useCase.execute({ id: (await categoryModel).id });

    const entity = await CategorySequelize.CategoryModel.findByPk((await categoryModel).id);

    expect(entity).toBeNull();
  });
});
