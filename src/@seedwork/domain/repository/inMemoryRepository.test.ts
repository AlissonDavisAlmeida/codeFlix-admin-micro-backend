import { Entity } from "../entities/Entity";
import { NotFoundError } from "../errors/not-found.error";
import { UniqueEntityID } from "../value-objects/uniqueEntityID";
import { InMemoryRepository } from "./inMemoryRepository";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> { }

class StubInMemory extends InMemoryRepository<StubEntity> { }

describe("In Memory repository tests", () => {
  let repository: StubInMemory;

  beforeEach(() => {
    repository = new StubInMemory();
  });

  it("should create a new entity", async () => {
    const stubEntity = new StubEntity({ name: "test", price: 10 });

    await repository.create(stubEntity);

    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toStrictEqual(stubEntity);
    expect(stubEntity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("throws error when entity not found", async () => {
    expect(repository.findById("1")).rejects.toThrow(
      new NotFoundError("Entity not found using id: 1"),
    );

    const uniqueEntityID = new UniqueEntityID();

    expect(repository.findById(uniqueEntityID.value)).rejects.toThrow(
      new NotFoundError(`Entity not found using id: ${uniqueEntityID.value}`),
    );
  });

  it("should finds a entity by id", async () => {
    const stubEntity = new StubEntity({ name: "test", price: 10 });
    await repository.create(stubEntity);

    let entityFound = await repository.findById(stubEntity.id);

    expect(entityFound.toJSON()).toStrictEqual(stubEntity.toJSON());

    entityFound = await repository.findById(stubEntity.uniqueEntityId);

    expect(entityFound.toJSON()).toStrictEqual(stubEntity.toJSON());
  });

  it("should returns all entities", async () => {
    const stubEntity = new StubEntity({ name: "test", price: 10 });
    await repository.create(stubEntity);

    const stubEntity2 = new StubEntity({ name: "test2", price: 20 });
    await repository.create(stubEntity2);

    const entities = await repository.findAll();

    expect(entities.length).toBe(2);
    expect(entities[0].toJSON()).toStrictEqual(stubEntity.toJSON());
    expect(entities[1].toJSON()).toStrictEqual(stubEntity2.toJSON());
    expect(entities).toStrictEqual([stubEntity, stubEntity2]);
  });

  it("should throws error on update when entity not found", async () => {
    const stubEntity = new StubEntity({ name: "test", price: 10 });
    expect(() => repository.update(stubEntity)).rejects.toThrow(
      new NotFoundError(`Entity not found using id: ${stubEntity.id}`),
    );
  });

  it("should update a entity", async () => {
    const stubEntity = new StubEntity({ name: "test", price: 10 });
    await repository.create(stubEntity);

    const stubEntity2 = new StubEntity({ name: "test2", price: 20 }, stubEntity.uniqueEntityId);
    await repository.update(stubEntity2);

    expect(repository.items.length).toBe(1);
    expect(repository.items[0].toJSON()).toStrictEqual(stubEntity2.toJSON());
    expect(repository.items).toStrictEqual([stubEntity2]);
  });

  it("should throws error on delete when entity not found", async () => {
    expect(() => repository.delete("1")).rejects.toThrow(
      new NotFoundError("Entity not found using id: 1"),
    );
  });

  it("should delete a entity", async () => {
    const stubEntity = new StubEntity({ name: "test", price: 10 });
    await repository.create(stubEntity);

    await repository.delete(stubEntity.id);

    expect(repository.items).toHaveLength(0);
    expect(repository.items).toStrictEqual([]);
  });
});
