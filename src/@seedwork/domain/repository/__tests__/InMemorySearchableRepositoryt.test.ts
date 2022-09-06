import { BaseEntity } from "../../entity/BaseEntity";
import { InMemorySearchableRepository } from "../inMemory.repository";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends BaseEntity<StubEntityProps> { }

class StubInMemorySearchableRepository extends InMemorySearchableRepository<
StubEntity
> {
  protected async applyFilter(items: StubEntity[], filter: string | null): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => item.props.name.toLowerCase().includes(filter.toLowerCase())
      || item.props.price.toString() === filter);
  }

  sortableFields: string[] = ["name"];
}

describe("InMemorySearchableRepository unit tests", () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
  });
  describe("applyFilter method", () => {
    it("should no filter items when filter param is null", async () => {
      const items = [new StubEntity({
        name: "Item 1",
        price: 10,
      })];

      const methodFilter = jest.spyOn(items, "filter");

      const result = await repository["applyFilter"](items, null);

      expect(result).toStrictEqual(items);
      expect(methodFilter).not.toHaveBeenCalled();
    });

    it("should filter items by name", async () => {
      const items = [
        new StubEntity({
          name: "Item 1",
          price: 10,
        }),
        new StubEntity({
          name: "Item 2",
          price: 20,
        }),
        new StubEntity({
          name: "ITEM 2",
          price: 20,
        }),
      ];

      const methodFilter = jest.spyOn(items, "filter");

      let result = await repository["applyFilter"](items, "item 1");

      expect(result).toStrictEqual([items[0]]);

      result = await repository["applyFilter"](items, "ITEM 2");

      expect(result).toStrictEqual([...items.slice(1, 3)]);

      result = await repository["applyFilter"](items, "20");

      expect(result).toStrictEqual([...items.slice(1, 3)]);

      result = await repository["applyFilter"](items, "10");

      expect(result).toStrictEqual([items[0]]);

      expect(methodFilter).toHaveBeenCalledTimes(4);
    });
  });

  describe("sort method", () => {
    it("should no sort items", async () => {
      const items = [
        new StubEntity({
          name: "b",
          price: 10,
        }),
        new StubEntity({
          name: "a",
          price: 20,
        }),
      ];

      let result = await repository["applySort"](items, null, null);
      expect(result).toStrictEqual(items);

      result = await repository["applySort"](items, "price", "asc");
      expect(result).toStrictEqual(items);
    });

    it("should sort items by name", async () => {
      const items = [
        new StubEntity({
          name: "b",
          price: 10,
        }),
        new StubEntity({
          name: "a",
          price: 20,
        }),
        new StubEntity({
          name: "c",
          price: 20,
        }),
      ];

      let result = await repository["applySort"](items, "name", "asc");
      expect(result).toStrictEqual([items[1], items[0], items[2]]);

      result = await repository["applySort"](items, "name", "desc");
      expect(result).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe("pagination method", () => {
    it("should no paginate items", async () => {
      const items = [
        new StubEntity({
          name: "b",
          price: 10,
        }),
        new StubEntity({
          name: "a",
          price: 20,
        }),
        new StubEntity({
          name: "c",
          price: 10,
        }),
        new StubEntity({
          name: "d",
          price: 20,
        }),
        new StubEntity({
          name: "e",
          price: 10,
        }),
        new StubEntity({
          name: "f",
          price: 20,
        }),
        new StubEntity({
          name: "f",
          price: 20,
        }),
      ];

      let result = await repository["applyPagination"](items);
      expect(result).toStrictEqual(items);

      result = await repository["applyPagination"](items, 1, 3);
      expect(result).toStrictEqual([items[0], items[1], items[2]]);

      result = await repository["applyPagination"](items, 2, 3);
      expect(result).toStrictEqual([items[3], items[4], items[5]]);

      result = await repository["applyPagination"](items, 3, 3);
      expect(result).toStrictEqual([items[6]]);

      result = await repository["applyPagination"](items, 1, 10);
      expect(result).toStrictEqual(items);
    });

    /*  it("should paginate items", async () => {
      const items = [
        new StubEntity({
          name: "b",
          price: 10,
        }),
        new StubEntity({
          name: "a",
          price: 20,
        }),
        new StubEntity({
          name: "c",
          price: 20,
        }),
      ];

      let result = await repository["applyPagination"](items, 1, 1);
      expect(result).toStrictEqual([items[0]]);

      result = await repository["applyPagination"](items, 1, 2);
      expect(result).toStrictEqual([items[0], items[1]]);

      result = await repository["applyPagination"](items, 2, 2);
      expect(result).toStrictEqual([items[2]]);
    }); */
  });

  describe("search method", () => { });
});
