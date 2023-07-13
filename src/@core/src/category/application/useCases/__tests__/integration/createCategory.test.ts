import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { CreateCategory } from "../../createCategory";

const { CategoryModel, CategorySequelizeRepository } = CategorySequelize;

describe("Create Category use case", () => {
  let useCase: CreateCategory;
  let repository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({
    models: [CategoryModel],
  });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategory(repository);
  });

  it("should create a category", async () => {
    const category = await useCase.execute({
      name: "Category Test",
      description: "Category description test",
      is_active: true,
    });

    const entity = await repository.findById(category.id);

    expect(category.id).toEqual(entity.id);
    expect(category.name).toEqual(entity.name);
    expect(category.description).toEqual(entity.description);
    expect(category.is_active).toEqual(entity.is_active);
    expect(category.created_at).toEqual(entity.props.created_at);
  });
});
