import { NotFoundError } from "../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../domain/entities/Category";
import { CategoryRepositoryInMemory } from "../../../infra/repositories/category-repository-inMemory";
import { GetCategory } from "../getCategory";

describe("Get Category use case tests", () => {
  let useCase: GetCategory;
  let repository: CategoryRepositoryInMemory;

  beforeEach(() => {
    repository = new CategoryRepositoryInMemory();
    useCase = new GetCategory(repository);
  });

  it("should throw Not Found when id not exists", async () => {
    expect(async () => useCase.execute({ id: "1" })).rejects.toThrowError(
      new NotFoundError("Entity not found using id: 1"),
    );
  });

  it("should return category when id exists", async () => {
    const items = [

      new Category({
        name: "Category 1",
        description: "Description 1",
      }),
      new Category({
        name: "Category 2",
        description: "Description 2",
      }),
    ];

    const spyFindById = jest.spyOn(repository, "findById");

    repository.items = items;

    const result = await useCase.execute({ id: items[0].id });

    expect(result).toStrictEqual(items[0]);
    expect(spyFindById).toBeCalledTimes(1);
  });
});
