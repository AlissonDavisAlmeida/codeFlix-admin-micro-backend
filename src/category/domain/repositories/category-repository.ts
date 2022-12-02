import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "../../../@seedwork/domain/repository/repository-contract";
import { Category } from "../entities/Category";

export namespace CategoryRepository {

  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> { }
  export class SearchResults extends DefaultSearchResult<Category, Filter> { }

  export interface Repository
    extends SearchableRepositoryInterface<
    Category,
    SearchParams,
    SearchResults
    > { }

}
