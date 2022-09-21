import { Console } from "console";
import { Category } from "../../../domain/entity/category";
import { NotFoundError } from "../../../../@seedwork/domain/errors/not-found.error";
import { CategoryInMemoryRepository } from "../../../infra/repository/category-repositoryInMemory";
import { UpdateCategory } from "../updateCategory";

describe("Category update", () => {
  let useCase: UpdateCategory;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategory(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "1", name: "fake" })).rejects.toThrow(new NotFoundError("Category not found"));
  });

  it("should update category", async () => {
    const spyUpdate = jest.spyOn(repository, "update");

    const category = new Category({ name: "fake", description: "fake" });
    repository.items = [category];
    const output = await useCase.execute({ name: "updated", id: category.id, description: "fake" });

    expect(spyUpdate).toHaveBeenCalled();

    await expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: "updated",
      description: "fake",
      is_active: true,
      created_at: category.createdAt,
    });

    const newCategory = new Category({ name: "fake2", description: "fake2" });
    repository.items = [...repository.items, newCategory];

    const output2 = await useCase.execute({
      id: newCategory.id, name: "updated", description: "fake",
    });

    expect(output2).toStrictEqual({
      id: repository.items[1].id,
      name: "updated",
      description: "fake",
      is_active: true,
      created_at: newCategory.createdAt,
    });
  });
});
