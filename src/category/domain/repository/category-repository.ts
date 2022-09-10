import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "@seedwork/domain/repository/repository.interface";
import { Category } from "../entity/category";

export namespace CategoryRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {

  }

  export class SearchResult extends DefaultSearchResult<Category, Filter> {

  }

  export interface Repository extends
    SearchableRepositoryInterface<
    Category,
    Filter,
    SearchParams,
    SearchResult> {

  }
}

// export type CategoryFilter = string;

// export class CategorySearchParams extends SearchParams<CategoryFilter> {

// }

// export class CategorySearchResult extends SearchResult<Category, CategoryFilter> {

// }

// export interface CategoryRepositoryInterface extends
//   SearchableRepositoryInterface<
//   Category,
//   CategoryFilter,
//   CategorySearchParams,
//   CategorySearchResult> {

// }
