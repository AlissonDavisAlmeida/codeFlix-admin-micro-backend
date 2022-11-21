import { Entity } from "../../entities/Entity";
import { InMemorySearchableRepository } from "../inMemoryRepository";

type StubEntityProps = {
  name: string
  price: number
};

class StubEntity extends Entity<StubEntityProps> { }

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ["name"];

  protected async applyFilter(items: StubEntity[], filter: string): Promise<StubEntity[]> {
    if (!filter) return items;

    return items.filter((item) => item.props.name.toLowerCase().includes(filter.toLocaleLowerCase())
      || item.props.price.toString().includes(filter));
  }
}

describe("InMemorySearchableRepository unit tests", () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
  });

  describe("applyFilter method", () => {
    it("should no filter items when filter params is null", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
      ];
      const filterMethodSpy = jest.spyOn(items, "filter");
      const filteredItems = await repository["applyFilter"](items, null);

      expect(filteredItems).toStrictEqual(items);
      expect(filterMethodSpy).not.toHaveBeenCalled();
    });

    it("should filter using a filter param", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
      ];
      const filterMethodSpy = jest.spyOn(items, "filter");

      let filteredItems = await repository["applyFilter"](items, "item");
      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(filterMethodSpy).toHaveBeenCalled();

      filteredItems = await repository["applyFilter"](items, "item 1");
      expect(filteredItems).toStrictEqual([items[0]]);

      filteredItems = await repository["applyFilter"](items, "20");
      expect(filteredItems).toStrictEqual([items[1]]);

      filteredItems = await repository["applyFilter"](items, "item 3");
      expect(filteredItems).toStrictEqual([]);

      filteredItems = await repository["applyFilter"](items, "10");
      expect(filteredItems).toStrictEqual([items[0]]);

      filteredItems = await repository["applyFilter"](items, "30");
      expect(filteredItems).toStrictEqual([]);

      filteredItems = await repository["applyFilter"](items, "ITEM");
      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(filterMethodSpy).toHaveBeenCalledTimes(7);
    });
  });

  describe("applySort method", () => {
    it("should no sort items when sort params is null", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
      ];
      let itemsSorted = await repository["applySort"](items, null, null);

      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await repository["applySort"](items, "price", null);

      expect(itemsSorted).toStrictEqual(items);
    });

    it("should sort items using a sort param", async () => {
      const items = [
        new StubEntity({ name: "b", price: 20 }),
        new StubEntity({ name: "a", price: 10 }),
        new StubEntity({ name: "c", price: 30 }),
      ];
      let itemsSorted = await repository["applySort"](items, "name", "asc");
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);

      itemsSorted = await repository["applySort"](items, "name", "desc");
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe("applyPaginate method", () => {
    it("should paginate items using a paginate param", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
        new StubEntity({ name: "item 3", price: 30 }),
        new StubEntity({ name: "item 4", price: 40 }),
        new StubEntity({ name: "item 5", price: 50 }),
      ];

      let itemsPaginated = await repository["applyPagination"](items, 1, 2);
      expect(itemsPaginated).toStrictEqual([items[0], items[1]]);

      itemsPaginated = await repository["applyPagination"](items, 2, 2);
      expect(itemsPaginated).toStrictEqual([items[2], items[3]]);

      itemsPaginated = await repository["applyPagination"](items, 3, 2);
      expect(itemsPaginated).toStrictEqual([items[4]]);

      itemsPaginated = await repository["applyPagination"](items, 4, 2);
      expect(itemsPaginated).toStrictEqual([]);
    });
  });

  describe("search method", () => { });
});
