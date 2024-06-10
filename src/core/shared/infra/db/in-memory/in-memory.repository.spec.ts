import { EntityNotFoundError } from "../../../domain/error/entity-not-found.error";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { Entity } from "../../../entity";
import { InMemoryRepository } from "./in-memory.repository";


describe("In memory repository unit tests", () => {

    type StubEntityProps = {
        entity_id?: Uuid;
        name: string;
        price: number;
    }

    const stubEntity: StubEntityProps = {
        name: "test",
        price: 100
    };

    class StubEntity extends Entity {

        entity_id: Uuid;
        name: string;
        price: number;

        constructor(data: StubEntityProps) {
            super();
            this.entity_id = data.entity_id || new Uuid();
            this.name = data.name;
            this.price = data.price;

        }

        toJSON() {
            return {
                entity_id: this.entity_id.id,
                name: this.name,
                price: this.price
            };
        }

    }


    class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid>{
        getEntity(): new (...args: any[]) => StubEntity {
            return StubEntity;
        }

    }

    let repository: StubInMemoryRepository;

    beforeEach(() => {
        repository = new StubInMemoryRepository();
    });

    test("should insert a new entity", async () => {
        const entity = new StubEntity(stubEntity);

        await repository.insert(entity);

        expect(repository.items).toHaveLength(1);
        expect(repository.items[0]).toBe(entity);
    });

    test("should bulk insert entities", async () => {
        const entities = [new StubEntity(stubEntity), new StubEntity(stubEntity)];

        await repository.bulkInsert(entities);

        expect(repository.items).toHaveLength(2);
        expect(repository.items).toEqual(entities);
    });

    test("should returns all entities", async () => {
        const entities = [new StubEntity(stubEntity), new StubEntity(stubEntity)];

        await repository.bulkInsert(entities);

        const result = await repository.findAll();

        expect(result).toEqual(entities);
    });

    test("should update an entity", async () => {
        const entity = new StubEntity(stubEntity);

        await repository.insert(entity);

        entity.price = 200;

        await repository.update(entity);

        expect(repository.items[0]).toEqual(entity);
    });

    test("should throws an error when try to update an entity that does not exist", async () => {
        const entity = new StubEntity(stubEntity);

        await expect(repository.update(entity)).rejects.toThrow(new EntityNotFoundError(entity.entity_id, StubEntity));
    });

    test("should delete an entity", async () => {
        const entity = new StubEntity(stubEntity);

        await repository.insert(entity);

        await repository.delete(entity.entity_id);

        expect(repository.items).toHaveLength(0);
    });

    test("should throws an error when try to delete an entity that does not exist", async () => {
        const entity = new StubEntity(stubEntity);

        await expect(repository.delete(entity.entity_id)).rejects.toThrow(new EntityNotFoundError(entity.entity_id, StubEntity));
    });
});