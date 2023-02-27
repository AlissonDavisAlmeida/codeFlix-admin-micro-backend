import { Category } from "../../../domain/entities/Category";
import { CategoryRepositoryInMemory } from "./category-repository-inMemory";

describe("Category InMemory Repository", () => {
  let repository: CategoryRepositoryInMemory;

  beforeEach(() => {
    repository = new CategoryRepositoryInMemory();
  });

  it("should no filter when filter object is null", async () => {
    const items = [
      new Category({ name: "Category 1" }),
    ];

    const filterSpy = jest.spyOn(items, "filter");

    let itemsFiltered = await repository["applyFilter"](items, null);

    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter param", async () => {
    const items = [
      new Category({ name: "Category 1" }),
      new Category({ name: "Category 2" }),
      new Category({ name: "Category 3" }),
    ];

    const filterSpy = jest.spyOn(items, "filter");

    let itemsFiltered = await repository["applyFilter"](items, "Category 2");

    expect(filterSpy).toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual([items[1]]);

    itemsFiltered = await repository["applyFilter"](items, "Category");

    expect(filterSpy).toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual([...items]);
  });

  it("should sort by created_at desc when sort param is null", async () => {
    const createdAt = new Date();

    const items = [
      new Category({ name: "Category 1", created_at: createdAt }),
      new Category({ name: "Category 2", created_at: new Date(createdAt.getTime() + 100) }),
      new Category({ name: "Category 3", created_at: new Date(createdAt.getTime() + 200) }),
    ];

    let itemsSorted = await repository["applySort"](items, null, null);

    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });
});
