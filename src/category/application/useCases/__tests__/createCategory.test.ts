import { CategoryInMemoryRepository } from "../../../infra/repository/category-repositoryInMemory";
import { CreateCategory } from "../createCategory";

describe("CreateCategory", () => {
  let useCase: CreateCategory;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategory(repository);
  });

  it("should be able to create a new category", async () => {
    const saveRepositorySpyOn = jest.spyOn(repository, "save");

    const category = await useCase.execute({
      name: "Category Test",
    });

    expect(category).toHaveProperty("id");
    expect(category.name).toBe("Category Test");
    expect(category.description).toBe(null);
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBe(repository.items[0].createdAt);

    expect(repository.items.length).toBe(1);

    const category2 = await useCase.execute({
      name: "Category Test 2",
      description: "Category Test 2 Description",
      isActive: false,
    });

    expect(category2).toHaveProperty("id");
    expect(category2.name).toBe("Category Test 2");
    expect(category2.description).toBe("Category Test 2 Description");
    expect(category2.is_active).toBe(false);
    expect(category2.created_at).toBe(repository.items[1].createdAt);

    expect(saveRepositorySpyOn).toHaveBeenCalledTimes(2);
  });
});
