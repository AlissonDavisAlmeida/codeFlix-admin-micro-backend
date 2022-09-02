import { BaseEntity } from "../entity/BaseEntity";
import { NotFoundError } from "../errors/not-found.error";
import { UniqueIdentity } from "../valueObjects/unique_identity";
import {
  RepositoryInterface, SearchableRepositoryInterface, SearchParams, SearchResult,
} from "./repository.interface";

export abstract class InMemoryRepository<T extends BaseEntity> implements RepositoryInterface<T> {
  items: T[] = [];

  async findById(id: string | UniqueIdentity): Promise<T> {
    const idformatted = `${id}`;
    const itemDiscovery = await this.getItemFromId(idformatted);

    return itemDiscovery;
  }

  async findAll(): Promise<T[]> {
    return Promise.resolve(this.items);
  }

  async save(entity: T): Promise<T> {
    this.items.push(entity);

    return Promise.resolve(entity);
  }

  async update(entity: T): Promise<T> {
    let foundItem = await this.getItemFromId(entity.id);

    foundItem = JSON.parse(JSON.stringify(entity));

    this.items = this.items.map((item: T) => (item.id === foundItem.id ? foundItem : item));

    return Promise.resolve(foundItem);
  }

  async delete(id: string | UniqueIdentity): Promise<void> {
    const idformatted = `${id}`;
    await this.getItemFromId(idformatted);

    this.items = this.items.filter((item: T) => item.id !== idformatted);
  }

  private async getItemFromId(id: string): Promise<T> {
    const itemDiscovery = this.items.find((item: T) => item.id === id);

    if (!itemDiscovery) {
      throw new NotFoundError(`Item not found with id: ${id}`);
    }

    return itemDiscovery;
  }
}

export abstract class InMemorySearchableRepository<T extends BaseEntity>
  extends InMemoryRepository<T>
  implements SearchableRepositoryInterface<T> {
  sortableFields: string[] = [];

  async search(query: SearchParams): Promise<SearchResult<T>> {
    const itemsFiltered = await this.applyFilter(this.items, query.filter);

    const itemsSorted = await this.applySort(itemsFiltered, query.sort, query.sort_dir);

    const itemsPaginated = await this.applyPagination(itemsSorted, query.page, query.per_page);

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: query.page,
      per_page: query.per_page,
      sort: query.sort,
      sort_dir: query.sort_dir,
      filter: query.filter,
    });
  }

  protected abstract applyFilter(items: T[], filter: string | null): Promise<T[]>;

  protected async applySort(items: T[], sort: string | null, sort_dir: string | null): Promise<T[]> {
    if (sort || this.sortableFields.includes(sort)) {
      [...items].sort((a, b) => {
        if (a.props[sort] < b.props[sort]) {
          return sort_dir === "asc" ? -1 : 1;
        }
        if (a.props[sort] > b.props[sort]) {
          return sort_dir === "asc" ? 1 : -1;
        }

        return 0;
      });
    }

    return items;
  }

  protected async applyPagination(
    items: T[],
    page: SearchParams["_page"],
    per_page: SearchParams["_per_page"],
  ): Promise<T[]> {

  }
}
