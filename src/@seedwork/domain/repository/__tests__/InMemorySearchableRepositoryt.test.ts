import { BaseEntity } from "../../entity/BaseEntity";
import { InMemorySearchableRepository } from "../inMemory.repository";
import { SearchParams, SearchResult } from "../repository.interface";

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

  describe("search method", () => {
    it("should apply only paginate when order params are null", async () => {
      const entity = new StubEntity({ name: "Item 1", price: 10 });
      const items = Array(16).fill(entity);
      repository.items = items;
      const result = await repository.search(new SearchParams());

      expect(result).toStrictEqual(new SearchResult({
        items: Array(15).fill(entity),
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      }));
    });

    it("should apply paginate and filter", async () => {
      const items = [
        new StubEntity({
          name: "Item",
          price: 10,
        }),
        new StubEntity({
          name: "item",
          price: 20,
        }),
        new StubEntity({
          name: "ItEM",
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
          name: "iTEM",
          price: 20,
        }),
      ];
      repository.items = items;

      let result = await repository.search(new SearchParams({
        page: 1,
        per_page: 3,
        filter: "item",
      }));

      expect(result).toStrictEqual(new SearchResult({
        items: [items[0], items[1], items[2]],
        total: 4,
        current_page: 1,
        per_page: 3,
        sort: null,
        sort_dir: null,
        filter: "item",
      }));

      result = await repository.search(new SearchParams({
        page: 2,
        per_page: 2,
        filter: "item",
      }));

      expect(result).toStrictEqual(new SearchResult({
        items: [items[2], items[6]],
        total: 4,
        current_page: 2,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: "item",
      }));
    });

    it("should apply paginate and sort", async () => {
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
          name: "g",
          price: 20,
        }),
      ];
      repository.items = items;

      let result = await repository.search(new SearchParams({
        page: 1,
        per_page: 3,
        sort: "name",
      }));

      expect(result).toStrictEqual(new SearchResult({
        items: [items[1], items[0], items[2]],
        total: 7,
        current_page: 1,
        per_page: 3,
        sort: "name",
        sort_dir: "asc",
        filter: null,
      }));

      result = await repository.search(new SearchParams({
        page: 2,
        per_page: 2,
        sort: "name",
      }));

      expect(result).toStrictEqual(new SearchResult({
        items: [items[2], items[3]],
        total: 7,
        current_page: 2,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: null,
      }));

      result = await repository.search(new SearchParams({
        page: 1,
        per_page: 4,
        sort: "name",
        sort_dir: "desc",
      }));

      expect(result).toStrictEqual(new SearchResult({
        items: [items[6], items[5], items[4], items[3]],
        total: 7,
        current_page: 1,
        per_page: 4,
        sort: "name",
        sort_dir: "desc",
        filter: null,
      }));
    });

    it("should apply paginate, filter and sort", async () => {
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
          name: "g",
          price: 20,
        }),
      ];
      repository.items = items;

      let result = await repository.search(new SearchParams({
        page: 1,
        per_page: 3,
        sort: "name",
        filter: "b",
      }));

      expect(result).toStrictEqual(new SearchResult({
        items: [items[0]],
        total: 1,
        current_page: 1,
        per_page: 3,
        sort: "name",
        sort_dir: "asc",
        filter: "b",
      }));

      result = await repository.search(new SearchParams({
        page: 2,
        per_page: 2,
        sort: "name",
        filter: "a",
      }));

      expect(result).toStrictEqual(new SearchResult({
        items: [],
        total: 1,
        current_page: 2,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: "a",
      }));

      result = await repository.search(new SearchParams({
        page: 1,
        per_page: 4,
        sort: "name",
        sort_dir: "desc",
        filter: "a",
      }));

      expect(result).toStrictEqual(new SearchResult({
        items: [items[1]],
        total: 1,
        current_page: 1,
        per_page: 4,
        sort: "name",
        sort_dir: "desc",
        filter: "a",
      }));
    });
  });
});
