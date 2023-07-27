import { UpdateCategory } from "#category/application";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { Category } from "../../../../domain/entities/Category";

describe("Update Category integration use case", () => {
  let useCase: UpdateCategory;
  let repository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({
    models: [CategorySequelize.CategoryModel],
  });

  beforeEach(() => {
    repository = new CategorySequelize.CategorySequelizeRepository(CategorySequelize.CategoryModel);
    useCase = new UpdateCategory(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "123", name: "Category Test" })).rejects.toThrowError("Entity not found using id: 123");
  });

  it("should update a category", async () => {
    const newCategory = await CategorySequelize.CategoryModel.factory().create();

    const category = await useCase.execute({
      id: newCategory.id,
      name: "Category",
    });

    expect(category).toHaveProperty("id");
    expect(category.id).toEqual(newCategory.id);
    expect(category.name).toEqual("Category");
    expect(category.description).toBeNull();
    expect(category.is_active).toEqual(newCategory.is_active);
    expect(category.created_at).toEqual(newCategory.created_at);
  });
});
