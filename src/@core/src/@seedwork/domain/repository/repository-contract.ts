import { Entity } from "../entities/Entity";
import { UniqueEntityID } from "../value-objects/uniqueEntityID";

export interface RepositoryInterface<GenericEntity extends Entity> {
  create(data: GenericEntity): Promise<void>;
  update(data: GenericEntity): Promise<void>;
  delete(id: string | UniqueEntityID): Promise<void>;
  findById(id: string | UniqueEntityID): Promise<GenericEntity>;
  findAll(): Promise<GenericEntity[]>;
}

export type SortDirection = "asc" | "desc";

export type SearchProps<Filter> = {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> {
  protected _page: number;

  protected _per_page = 15;

  protected _sort: string | null;

  protected _sort_dir: SortDirection | null;

  protected _filter: Filter;

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir || "asc";
    this.filter = props.filter;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let _page = +value;

    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  get per_page() {
    return this._per_page;
  }

  private set per_page(value: number) {
    let _per_page = typeof value === "boolean" ? null : +value;

    if (Number.isNaN(_per_page) || _per_page <= 0 || parseInt(_per_page as any) !== _per_page) {
      _per_page = this._per_page;
    }

    this._per_page = _per_page;
  }

  get sort() {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort = (value === null || value === undefined || value === "") ? null : `${value}`;
  }

  get sort_dir() {
    return this._sort_dir;
  }

  private set sort_dir(value: SortDirection) {
    if (!this._sort) {
      this._sort_dir = null;
      return;
    }

    const dir = `${value.toLowerCase()}`;
    this._sort_dir = (dir === "asc" || dir === "desc") ? dir : "asc";
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(value: Filter | null) {
    this._filter = (value === null || value === undefined || value === "") ? null : `${value}` as Filter;
  }
}

type SearchResultProps<GenericEntity extends Entity, Filter> = {
  items: GenericEntity[];

  total: number;

  current_page: number;

  per_page: number;

  sort: string | null;

  sort_dir: SortDirection | null;

  filter: Filter
};

export class SearchResult<GenericEntity extends Entity, Filter = string> {
  readonly items: GenericEntity[];

  readonly total: number;

  readonly current_page: number;

  readonly per_page: number;

  readonly last_page: number;

  readonly sort: string | null;

  readonly sort_dir: SortDirection | null;

  readonly filter: Filter;

  constructor(props: SearchResultProps<GenericEntity, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = Math.ceil(props.total / props.per_page);
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map((item) => item.toJSON()) : this.items,
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

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput = SearchParams,
  SearchOutput = SearchResult<E>,
>
  extends RepositoryInterface<E> {
  sortableFields: string[];
  search(params: SearchInput): Promise<SearchOutput>;
}
