import { Repository, SearchableRepository, SearchParamsInput, SearchParamsResult } from "../../../data";
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

export type ApplyFilterProps<E, Filter> = Pick<SearchParamsInput<Filter>, "filter"> & { items: E[] };
export type ApplySortProps<E, SortBy = string> = Pick<SearchParamsInput<string, SortBy>, "sortBy" | "sortDirection"> & { items: E[], custom_getter?: (sort: SortBy, item: E) => any };
export type ApplyPaginationProps<E> = Pick<SearchParamsInput<number>, "page" | "perPage"> & { items: E[] };

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string,
    SortBy = string
>
    extends InMemoryRepository<E, EntityId>
    implements SearchableRepository<E, EntityId, Filter, SortBy>{

    sortableFields: Set<SortBy> = new Set();

    async search(props: SearchParamsInput<Filter, SortBy>): Promise<SearchParamsResult<E>> {
        const itemsFiltered = await this.applyFilter({ filter: props.filter, items: this.items });
        const itemsSorted = await this.applySort({ sortBy: props.sortBy, sortDirection: props.sortDirection, items: itemsFiltered });
        const itemsPaginated = await this.applyPagination({ page: props.page, perPage: props.perPage, items: itemsSorted });

        const result = new SearchParamsResult<E>({
            items: itemsPaginated,
            total: itemsFiltered.length,
            current_page: props.page,
            per_page: props.perPage,
            last_page: Math.ceil(itemsFiltered.length / props.perPage)
        });

        return result;
    }

    protected abstract applyFilter(props: ApplyFilterProps<E, Filter>): Promise<E[]>;

    async applySort(props: ApplySortProps<E, SortBy>): Promise<E[]> {
        const { sortBy, sortDirection, items } = props;

        if (!sortBy || !this.sortableFields.has(sortBy)) {
            return items;
        }

        return [...items].sort((a, b) => {
            const aValue = props.custom_getter ? props.custom_getter(sortBy, a) : a[sortBy as keyof E];
            const bValue = props.custom_getter ? props.custom_getter(sortBy, b) : b[sortBy as keyof E];

            if (aValue > bValue) {
                return sortDirection === "asc" ? 1 : -1;
            }

            if (aValue < bValue) {
                return sortDirection === "asc" ? -1 : 1;
            }

            return 0;

        });

    }

    async applyPagination(props: ApplyPaginationProps<E>): Promise<E[]> {
        const start = (props.page - 1) * props.perPage;
        const end = start + props.perPage;

        return props.items.slice(start, end);
    }


}