import { isBoolean } from "lodash";
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

export class SearchParams<Filter = string> {
  protected _page: number;

  protected _per_page = 15;

  protected _sort: string | null;

  protected _sort_dir: "asc" | "desc" | null;

  protected _filter: Filter | null;

  constructor(props: SearchProps<Filter> = {}) {
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
    let page = Number(value);

    // eslint-disable-next-line radix
    if (Number.isNaN(page) || page < 1 || parseInt(page.toString()) !== page) {
      page = 1;
    }

    this._page = page;
  }

  get per_page(): number {
    return this._per_page;
  }

  private set per_page(value: number) {
    if (isBoolean(value)) {
      return;
    }
    let per_page = Number(value);

    // eslint-disable-next-line radix
    if (Number.isNaN(per_page) || per_page <= 0 || parseInt(per_page.toString()) !== per_page) {
      per_page = this._per_page;
    }
    this._per_page = per_page;
  }

  get sort(): string | null {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort = value === null || value === undefined || value === "" ? null : value.toString();
  }

  get sort_dir(): "asc" | "desc" | null {
    return this._sort_dir;
  }

  private set sort_dir(value: string | null) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }

    const dir = `${value}`.trim().toLowerCase();
    this._sort_dir = dir !== "asc" && dir !== "desc" ? "asc" : dir;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(value: Filter | null) {
    this._filter = !value ? null : `${value}` as Filter;
  }
}

type SearchResultProps<Entity extends BaseEntity, Filter> = {
  items: Entity[];
  total: number;
  current_page: number
  per_page: number
  sort: string | null
  sort_dir: "asc" | "desc" | null
  filter: Filter | null
};

export class SearchResult<Entity extends BaseEntity= BaseEntity, Filter = string> {
  readonly items: Entity[];

  readonly total: number;

  readonly current_page: number;

  readonly per_page: number;

  readonly last_page: number;

  readonly sort: string | null;

  readonly sort_dir: "asc" | "desc" | null;

  readonly filter: Filter;

  constructor(props: SearchResultProps<Entity, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = Math.ceil(this.total / this.per_page);
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  toJSON() {
    return {
      items: this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
      sort: this.sort,
      sort_dir: this.sort_dir,
      filter: this.filter,
    };
  }
}

export interface SearchableRepositoryInterface
  <T extends BaseEntity,
    Filter = string,
    SearchInput = SearchParams<Filter>,
    SearchOutput = SearchResult<T, Filter>>
  extends RepositoryInterface<T> {
  sortableFields: string[];
  search(query: SearchInput): Promise<SearchOutput>;
}
