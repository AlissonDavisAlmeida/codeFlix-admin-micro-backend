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

  sortableFields = ["name"];
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

  describe("sort method", () => { });

  describe("pagination method", () => { });

  describe("search method", () => { });
});
