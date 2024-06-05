import { PaginationOutput, PaginationOutputMapper } from "../../../shared/application/pagination-output";
import { IUseCase } from "../../../shared/application/use-case.interface";
import { SortDirection } from "../../../shared/data";
import { CategoryFilter, CategoryRepository, CategorySearchParamsInput, CategorySortBy } from "../../data/category.repository";
import { CategoryConstructorProps } from "../../domain/entities/category.entity";

export type SearchCategoryUseCaseInput = {
    page?: number;
    per_page?: number;
    sort_by?: CategorySortBy | null;
    sort_direction?: SortDirection | null;
    filter?: CategoryFilter | null;
}
export type SearchCategoryUseCaseOutput = PaginationOutput<CategoryConstructorProps>


export class SearchCategoryUseCase implements IUseCase<SearchCategoryUseCaseInput, SearchCategoryUseCaseOutput> {

    constructor(private readonly categoryRepository: CategoryRepository) { }

    execute = async (input: SearchCategoryUseCaseInput): Promise<SearchCategoryUseCaseOutput> => {
        const searchInput = new CategorySearchParamsInput(input);
        const searchResult = await this.categoryRepository.search(searchInput);
        return PaginationOutputMapper.toOutput(searchResult.items, searchResult);

    };
}