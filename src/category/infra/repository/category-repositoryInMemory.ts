import { CategoryRepositoryInterface } from "category/domain/repository/category-repository";
import { Category } from "../../domain/entity/category";
import { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/inMemory.repository";

export class CategoryInMemoryRepository extends InMemorySearchableRepository<Category> implements CategoryRepositoryInterface {
  protected applyFilter(items: Category[], filter: string): Promise<Category[]> {
    throw new Error("Method not implemented.");
  }

  protected applySort(items: Category[], sort: string, sort_dir: string): Promise<Category[]> {
    throw new Error("Method not implemented.");
  }

  protected applyPagination(items: Category[], page: number, per_page: number): Promise<Category[]> {
    throw new Error("Method not implemented.");
  }
}
