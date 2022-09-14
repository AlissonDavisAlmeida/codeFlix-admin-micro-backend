import { NotFoundError } from "../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../domain/entity/category";
import { CategoryInMemoryRepository } from "../../../infra/repository/category-repositoryInMemory";
import { GetCategory } from "../getCategory";

describe("GetCategory tests", () => {
  let useCase: GetCategory;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategory(repository);
  });

  it("should throws error when entity not found", async () => {
    expect(() => useCase.execute({ id: "1" })).rejects.toThrow(new NotFoundError("Category not found"));
  });

  it("should get a category", async () => {
    const items = [
      new Category({ name: "Category 1" }),
    ];

    repository.items = items;
    const spyInsert = jest.spyOn(repository, "findById");

    const result = await useCase.execute({ id: items[0].id });

    expect(result).toStrictEqual({
      id: items[0].id,
      name: "Category 1",
      description: null,
      created_at: items[0].createdAt,
      is_active: true,
    });

    expect(spyInsert).toBeCalledTimes(1);
  });
});
