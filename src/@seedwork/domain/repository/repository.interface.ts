import { BaseEntity } from "../entity/BaseEntity";
import { UniqueIdentity } from "../valueObjects/unique_identity";

export interface RepositoryInterface<T extends BaseEntity> {

  findById(id: string | UniqueIdentity): Promise<T>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string | UniqueIdentity): Promise<void>;

}

export type SearchProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: "asc" | "desc" | null;
  filter?: Filter | null
};

export class SearchParams {
  protected _page: number;

  protected _per_page = 15;

  protected _sort: string | null;

  protected _sort_dir: "asc" | "desc" | null;

  protected _filter: string | null;

  constructor(props: SearchProps = {}) {
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  get page(): number {
    return this._page;
  }

  private set page(value: number) {

  }

  get per_page(): number {
    return this._per_page;
  }

  private set per_page(value: number) {
  }

  get sort(): string {
    return this._sort;
  }

  private set sort(value: string | null) {

  }

  get sort_dir(): string {
    return this._sort_dir;
  }

  private set sort_dir(value: string | null) {

  }

  get filter(): string {
    return this._filter;
  }

  private set filter(value: string | null) {}
}

export interface SearchableRepositoryInterface<T extends BaseEntity, SearchInput, SearchOutput> extends RepositoryInterface<T> {
  search(query: SearchInput): Promise<SearchOutput>;
}
