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
    filter: SearchParams["filter"]): Promise<GenericEntity[]>;

  protected abstract applySort(
    items: GenericEntity[],
    sort: SearchParams["sort"],
    sort_dir: SearchParams["sort_dir"]): Promise<GenericEntity[]>;

  protected abstract applyPagination(
    items: GenericEntity[],
    page: SearchParams["page"],
    perPage: SearchParams["per_page"]): Promise<GenericEntity[]>;
}
