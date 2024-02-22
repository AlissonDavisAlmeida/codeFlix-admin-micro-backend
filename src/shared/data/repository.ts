import { ValueObject } from "../domain/value-objects/value-object";
import { Entity } from "../entity";
import { SearchParamsInput } from "./search-input";
import { SearchParamsResult } from "./search-result";

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
    SearchOutput = SearchParamsResult<E>,
    SearchInput = SearchParamsInput,
> extends Repository<E, EntityId> {
    sortableFields: string[];

    search(props: SearchInput): Promise<SearchOutput>
}