import { SearchInputDTO } from "@seedwork/application/dto/search-input.dto";
import { PaginationOutputDTO } from "@seedwork/application/dto/pagination-output";
import { CategoryRepositoryInMemory } from "../../infra/repositories/category-repository-inMemory";
import { CategoryRepository } from "../../domain/repositories/category-repository";
import { UseCaseInterface } from "../../../@seedwork/application/useCase";

type ListCategoriesInput = SearchInputDTO<CategoryRepository.Filter>;

type CategoryOutput = {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  is_active?: boolean
};

type ListCategoryOutput = PaginationOutputDTO<CategoryOutput>;

export class ListCategories implements UseCaseInterface<ListCategoriesInput, ListCategoryOutput> {
  constructor(
    private categoryRepository: CategoryRepositoryInMemory,
  ) { }

  async execute(input: ListCategoriesInput): Promise<ListCategoryOutput> {
    const params = new CategoryRepository.SearchParams(input);

    const result = await this.categoryRepository.search(params);

    return {
      total: result.total,
      current_page: result.current_page,
      per_page: result.per_page,
      last_page: result.last_page,
      items: result.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        created_at: item.created_at,
        // is_active:q item.is_active,
      })),
    };
  }
}
