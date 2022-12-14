import { CategoryRepositoryInMemory } from "../../../infra/repositories/category-repository-inMemory";
import { CreateCategory } from "../createCategory";

describe("Create Category use case", () => {
  let useCase: CreateCategory;
  let repository: CategoryRepositoryInMemory;

  beforeEach(() => {
    repository = new CategoryRepositoryInMemory();
    useCase = new CreateCategory(repository);
  });

  it("should create a category", async () => {
    const createSpy = jest.spyOn(repository, "create");

    const category = await useCase.execute({
      name: "Category Test",
      description: "Category description test",
      is_active: true,
    });

    expect(createSpy).toHaveBeenCalled();
    expect(category).toHaveProperty("id");
    expect(category.id).toEqual(repository.items[0].id);
    expect(category.name).toEqual("Category Test");
    expect(category.description).toEqual("Category description test");
    expect(category.is_active).toEqual(true);
    expect(category.created_at).toEqual(repository.items[0].created_at);
  });
});
