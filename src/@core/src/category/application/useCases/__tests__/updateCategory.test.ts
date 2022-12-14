import { Category } from "../../../domain/entities/Category";
import { CategoryRepositoryInMemory } from "../../../infra/repositories/category-repository-inMemory";
import { UpdateCategory } from "../updateCategory";

describe("Update Category use case", () => {
  let useCase: UpdateCategory;
  let repository: CategoryRepositoryInMemory;

  beforeEach(() => {
    repository = new CategoryRepositoryInMemory();
    useCase = new UpdateCategory(repository);
  });

  it("should throws error when entity not found", async () => {
    expect(() => useCase.execute({ id: "123", name: "Category Test" })).rejects.toThrowError("Entity not found using id: 123");
  });

  it("should update a category", async () => {
    const updateSpy = jest.spyOn(repository, "update");

    const newCategory = new Category({
      name: "Category Test",
    });

    repository.items = [newCategory];

    const category = await useCase.execute({
      id: newCategory.id,
      name: "Category",
    });

    expect(updateSpy).toHaveBeenCalled();
    expect(category).toHaveProperty("id");
    expect(category.id).toEqual(newCategory.id);
    expect(category.name).toEqual("Category");
    expect(category.description).toBeNull();
    expect(category.is_active).toEqual(true);
    expect(category.created_at).toEqual(newCategory.created_at);
  });
});
