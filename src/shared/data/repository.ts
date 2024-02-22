import { ValueObject } from "../domain/value-objects/value-object";
import { Entity } from "../entity";
import { SearchParams } from "./search-params";

export interface Repository<E extends Entity, EntityId extends ValueObject> {
    insert(entity: E): Promise<void>;
    bulkInsert(entities: E[]): Promise<void>;
    update(entity: E): Promise<void>;
    delete(id: EntityId): Promise<void>;

    findById(id: EntityId): Promise<E | null>;
    findAll(): Promise<E[]>;

    getEntity(): new (...args: any[]) => E;
}

export interface SearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    SearchOutput,
    SearchInput = SearchParams,
> extends Repository<E, EntityId> {
    sortableFields: string[];

    search(props: SearchInput): Promise<SearchOutput>
}