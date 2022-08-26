import { BaseEntity } from "../entity/BaseEntity";
import { NotFoundError } from "../errors/not-found.error";
import { UniqueIdentity } from "../valueObjects/unique_identity";
import { RepositoryInterface, SearchableRepositoryInterface } from "./repository.interface";

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
  implements SearchableRepositoryInterface<T, any, any> {
  search(query: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
