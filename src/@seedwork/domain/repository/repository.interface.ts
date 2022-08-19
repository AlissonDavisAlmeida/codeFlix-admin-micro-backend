import { BaseEntity } from "../entity/BaseEntity";
import { UniqueIdentity } from "../valueObjects/unique_identity";

export interface RepositoryInterface<T extends BaseEntity> {

  findById(id: string | UniqueIdentity): Promise<T>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string | UniqueIdentity): Promise<void>;

}

export interface SearchableRepositoryInterface<T extends BaseEntity, SearchParams, SearchResult> extends RepositoryInterface<T> {
  search(query: SearchParams): Promise<SearchResult>;
}
