import { Category } from "../../domain/entity/category";
import { CategoryInMemoryRepository } from "./category-repositoryInMemory";

describe("Category InMemory Repository", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  it("should no filter items when filter object is null", async () => {
    const items = [new Category({ name: "test1" }), new Category({ name: "test2" })];
    const filterSpy = jest.spyOn(items, "filter");

    const itemsFiltered = await repository["applyFilter"](items, null);

    expect(itemsFiltered).toEqual(items);
    expect(filterSpy).not.toHaveBeenCalled();
  });

  it("should filter items using filter parameter", async () => {
    const items = [
      new Category({ name: "test" }),
      new Category({ name: "TEST" }),
      new Category({ name: "test3" }),
    ];

    const filterSpy = jest.spyOn(items, "filter");

    const itemsFiltered = await repository["applyFilter"](items, "test");

    expect(itemsFiltered).toStrictEqual([items[0], items[1], items[2]]);
    expect(filterSpy).toHaveBeenCalled();
  });

  it("should no sort items when sort parameter is null", async () => {
    const createdAt = new Date();

    const items = [
      new Category({ name: "test", createdAt }),
      new Category({ name: "test2", createdAt: new Date(createdAt.getTime() + 100) }),
      new Category({ name: "test3", createdAt: new Date(createdAt.getTime() + 200) }),
    ];

    const itemsSorted = await repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", async () => {
    const items = [
      new Category({ name: "c" }),
      new Category({ name: "b" }),
      new Category({ name: "a" }),
    ];

    const itemsSorted = await repository["applySort"](items, "name", "asc");

    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    const itemsSortedDesc = await repository["applySort"](items, "name", "desc");

    expect(itemsSortedDesc).toStrictEqual([items[0], items[1], items[2]]);
  });
});
