import { CategoryRepository } from "category/domain/repository/category-repository";
import { Category } from "../../domain/entity/category";
import { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/inMemory.repository";

export class CategoryInMemoryRepository extends InMemorySearchableRepository<Category> implements CategoryRepository.Repository {
  sortableFields: string[] = ["name", "createdAt", "updated_at"];

  protected async applyFilter(items: Category[], filter: CategoryRepository.Filter): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => item.props.name.toLowerCase().includes(filter.toLowerCase()));
  }

  protected async applySort(items: Category[], sort: string | null, sort_dir: "asc" | "desc" | null): Promise<Category[]> {
    return !sort ? super.applySort(items, "createdAt", "desc")
      : super.applySort(items, sort, sort_dir);
  }
}
