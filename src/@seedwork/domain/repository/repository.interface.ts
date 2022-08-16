import { BaseEntity } from "../entity/BaseEntity";
import { UniqueIdentity } from "../valueObjects/unique_identity";

export interface RepositoryInterface<T extends BaseEntity> {

  findById(id: string | UniqueIdentity): Promise<T>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string | UniqueIdentity): Promise<void>;

}
