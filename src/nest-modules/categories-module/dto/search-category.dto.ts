import { SearchCategoryUseCaseInput } from "@core/category/application/search-category/search-category.usecase";
import { CategorySortBy } from "@core/category/data/category.repository";
import { SortDirection } from "@core/shared/data";

export class SearchCategoryDTO implements SearchCategoryUseCaseInput {
    page?: number;
    per_page?: number;
    sort_by?: CategorySortBy;
    sort_direction?: SortDirection;
    filter?: string;
}