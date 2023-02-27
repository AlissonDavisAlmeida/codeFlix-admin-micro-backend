import { CategoryRepository } from "category/domain/repositories/category-repository";
import { InMemorySearchableRepository } from "#seedwork/domain/repository/inMemoryRepository";
import { Category } from "../../../domain/entities/Category";

export class CategoryRepositoryInMemory extends InMemorySearchableRepository<Category> implements CategoryRepository.Repository {
  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(items: Category[], filter: CategoryRepository.Filter): Promise<Category[]> {
    if (!filter) return items;

    return items.filter((item) => item.props.name.toLowerCase().includes(filter.toLocaleLowerCase()));
  }

  protected async applySort(items: Category[], sort: string, sort_dir: string): Promise<Category[]> {
    if (!sort) {
      return super.applySort(items, "created_at", "desc");
    }

    return super.applySort(items, sort, sort_dir);
  }
}
