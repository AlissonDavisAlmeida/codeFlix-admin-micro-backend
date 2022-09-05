import { BaseEntity } from "../../entity/BaseEntity";
import { NotFoundError } from "../../errors/not-found.error";
import { InMemoryRepository } from "../inMemory.repository";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends BaseEntity<StubEntityProps> {

}

class StubRepository extends InMemoryRepository<StubEntity> {

}

describe("InMemoryRepository", () => {
  let repository: StubRepository;

  beforeEach(() => {
    repository = new StubRepository();
  });

  it("should inserts a new Entity", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });
    await repository.save(entity);

    expect(repository.items.length).toBe(1);
    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("test")).rejects.toThrow(new NotFoundError("Item not found with id: test"));
    await expect(repository.findById("0fdb4026-4df1-4522-96d2-27c6ce868212"))
      .rejects.toThrow(new NotFoundError("Item not found with id: 0fdb4026-4df1-4522-96d2-27c6ce868212"));
  });

  it("should find an entity by id", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });
    await repository.save(entity);

    let found = await repository.findById(entity.id);

    expect(found.toJSON()).toStrictEqual(entity.toJSON());

    found = await repository.findById(entity.uniqueEntityID);

    expect(found.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should find all entities", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });
    const entity2 = new StubEntity({ name: "test2", price: 2 });
    await repository.save(entity);
    await repository.save(entity2);

    const found = await repository.findAll();

    expect(found.length).toBe(2);
    expect(found).toStrictEqual([entity, entity2]);
  });

  it("should throws error on update when entity not found", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });

    await expect(repository.update(entity)).rejects.toThrow(new NotFoundError(`Item not found with id: ${entity.id}`));
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });
    await repository.save(entity);

    const entity2 = new StubEntity({ name: "test2", price: 2 }, entity.uniqueEntityID);
    await repository.update(entity2);
    expect(entity2.toJSON()).toStrictEqual(repository.items[0]);
  });

  it("should throws error on delete when entity not found", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });

    await expect(repository.delete(entity.id)).rejects.toThrow(new NotFoundError(`Item not found with id: ${entity.id}`));
  });

  it("should delete an entity", async () => {
    const entity = new StubEntity({ name: "test", price: 1 });
    await repository.save(entity);
    await repository.delete(entity.id);
    expect(repository.items.length).toBe(0);
    await repository.save(entity);

    await repository.delete(entity.uniqueEntityID);

    expect(repository.items.length).toBe(0);
  });
});
