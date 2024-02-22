import { Repository } from "../../../data/repository";
import { EntityNotFoundError } from "../../../domain/error/entity-not-found.error";
import { ValueObject } from "../../../domain/value-objects/value-object";
import { Entity } from "../../../entity";

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject> implements Repository<E, EntityId> {

    items: E[] = [];

    async insert(entity: E): Promise<void> {
        this.items.push(entity);
        return Promise.resolve();
    }

    async bulkInsert(entities: E[]): Promise<void> {
        this.items.push(...entities);
        return Promise.resolve();
    }

    async update(entity: E): Promise<void> {

        const index = this._getEntityIndex(entity.entity_id as EntityId);

        if (index === -1) {
            throw new EntityNotFoundError(entity.entity_id, this.getEntity());
        }

        this.items[index] = entity;

        return Promise.resolve();
    }

    async delete(id: EntityId): Promise<void> {
        const index = this._getEntityIndex(id);

        if (index === -1) {
            throw new EntityNotFoundError(id, this.getEntity());
        }

        this.items.splice(index, 1);

        return Promise.resolve();
    }

    async findById(id: EntityId): Promise<E | null> {
        const entity = this._getEntity(id);

        if (entity === null) {
            throw new EntityNotFoundError(id, this.getEntity());
        }

        return entity;
    }

    protected _getEntity(entity_id: EntityId): E | null {
        const item = this.items.find((item) => item.entity_id.equals(entity_id)) || null;

        return typeof item !== "undefined" ? item : null;
    }

    protected _getEntityIndex(entity_id: EntityId): number {
        return this.items.findIndex((item) => item.entity_id.equals(entity_id));
    }

    async findAll(): Promise<E[]> {
        return this.items;
    }
    abstract getEntity(): new (...args: any[]) => E;
}