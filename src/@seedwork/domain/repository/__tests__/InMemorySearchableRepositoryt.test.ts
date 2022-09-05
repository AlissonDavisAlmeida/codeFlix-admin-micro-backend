import { BaseEntity } from "@seedwork/domain/entity/BaseEntity";
import { InMemorySearchableRepository } from "../inMemory.repository";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends BaseEntity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<
StubEntity
> {
  protected async applyFilter(items: StubEntity[], filter: string): Promise<StubEntity[]> {
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

  });

  describe("sort method", () => {});

  describe("pagination method", () => {});

  describe("search method", () => {});
});
