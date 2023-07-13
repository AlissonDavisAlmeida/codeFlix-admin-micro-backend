import { ListCategories } from "#category/application";
import { Category } from "#category/domain";
import { CategoryRepositoryInMemory } from "#category/infra";

describe("List Categories use case test", () => {
  let useCase: ListCategories;
  let repository: CategoryRepositoryInMemory;

  beforeEach(() => {
    repository = new CategoryRepositoryInMemory();
    useCase = new ListCategories(repository);
  });

  it("should returns output using empty input with categories ordered by created_at", async () => {
    const creat = new Date();
    const items = [
      new Category({ name: "Category 1", description: "Category 1", created_at: creat }),
      new Category({ name: "Category 2", description: "Category 2", created_at: new Date(creat.getTime() + 100) }),
    ];

    repository.items = items;

    const result = await useCase.execute({});

    expect(result).toStrictEqual({
      items: [...items].reverse().map((item) => item.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should returns output using paginate, sort and filter", async () => {
    const creat = new Date();
    const items = [
      new Category({ name: "a", description: "Category 1", created_at: creat }),
      new Category({ name: "AAA", description: "Category 2", created_at: new Date(creat.getTime() + 100) }),
      new Category({ name: "AaA", description: "Category 2", created_at: new Date(creat.getTime() + 100) }),
      new Category({ name: "b", description: "Category 2", created_at: new Date(creat.getTime() + 100) }),
      new Category({ name: "c", description: "Category 2", created_at: new Date(creat.getTime() + 100) }),
    ];

    repository.items = items;

    let result = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "asc",
      filter: "a",
    });
    expect(result).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    result = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      sort_dir: "asc",
      filter: "a",
    });
    expect(result).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
  });
});
