import { Entity } from "../entities/Entity";
import { NotFoundError } from "../errors/not-found.error";
import { UniqueEntityID } from "../value-objects/uniqueEntityID";
import {
  RepositoryInterface, SearchableRepositoryInterface, SearchParams, SearchResult,
} from "./repository-contract";

export abstract class InMemoryRepository<GenericEntity extends Entity> implements RepositoryInterface<GenericEntity> {
  items: GenericEntity[] = [];

  async create(data: GenericEntity): Promise<void> {
    this.items.push(data);
  }

  async update(data: GenericEntity): Promise<void> {
    const itemFind = await this._get(data.id);

    const index = this.items.findIndex((item) => item.id === itemFind.id);

    this.items[index] = data;
  }

  async delete(id: string | UniqueEntityID): Promise<void> {
    const findItem = await this._get(`${id}`);

    const index = this.items.findIndex((item) => item.id === findItem.id);

    this.items.splice(index, 1);
  }

  async findById(id: string | UniqueEntityID): Promise<GenericEntity | null> {
    const entity = await this._get(`${id}`);

    return entity;
  }

  async findAll(): Promise<GenericEntity[]> {
    return this.items;
  }

  protected async _get(id: string): Promise<GenericEntity> {
    const _id = `${id}`;
    const itemFind = this.items.find((item) => item.id === _id);

    if (!itemFind) {
      throw new NotFoundError(`Entity not found using id: ${_id}`);
    }

    return itemFind;
  }
}

export abstract class InMemorySearchableRepository<GenericEntity extends Entity>
  extends InMemoryRepository<GenericEntity>
  implements SearchableRepositoryInterface<GenericEntity> {
  sortableFields: string[] = [];

  async search(params: SearchParams): Promise<SearchResult<GenericEntity>> {
    const itemsFiltered = await this.applyFilter(this.items, params.filter);
    const itemsSorted = await this.applySort(itemsFiltered, params.sort, params.sort_dir);
    const itemsPaginated = await this.applyPagination(itemsSorted, params.page, params.per_page);

    return new SearchResult<GenericEntity>({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: params.page,
      per_page: params.per_page,
      filter: params.filter,
      sort: params.sort,
      sort_dir: params.sort_dir,
    });
  }

  protected abstract applyFilter(
    items: GenericEntity[],
    filter: string | null): Promise<GenericEntity[]>;

  protected async applySort(
    items: GenericEntity[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<GenericEntity[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }
    const newItems = [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sort_dir === "asc" ? -1 : 1;
      }

      if (a.props[sort] > b.props[sort]) {
        return sort_dir === "asc" ? 1 : -1;
      }
      return 0;
    });

    return newItems;
  }

  protected async applyPagination(
    items: GenericEntity[],
    page: SearchParams["page"],
    perPage: SearchParams["per_page"],
  ): Promise<GenericEntity[]> {
    const start = (page - 1) * perPage;
    const limit = start + perPage;
    return items.slice(start, limit);
  }
}
