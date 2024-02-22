import { ValueObject } from "../domain/value-objects/value-object";

export type SortDirection = "asc" | "desc";

export type SearchParamsConstructorProps<Filter = string> = {
    page?: number;
    per_page?: number;
    sort_by?: string | null;
    sort_direction?: SortDirection | null;
    filter?: Filter | null;
}


export class SearchParams<Filter = string> extends ValueObject {
    protected _page: number;
    protected _perPage: number = 15;
    protected _sortBy: string | null;
    protected _sortDirection: SortDirection | null;
    protected _filter: Filter | null;

    constructor(props: SearchParamsConstructorProps<Filter> = {}) {
        super();
        this.page = props.page;
        this.perPage = props.per_page || 15;
        this.sortBy = props.sort_by || null;
        this.sortDirection = props.sort_direction || null;
        this.filter = props.filter || null;
    }

    get page() {
        return this._page;
    }

    private set page(value: number) {
        let _page = +value;

        if (Number.isNaN(_page) || _page < 1 || parseInt(_page as any) !== _page) {
            _page = 1;
        }

        this._page = _page;
    }

    get perPage() {
        return this._perPage;
    }

    private set perPage(value: number) {
        let _perPage = +value;

        if (Number.isNaN(_perPage) || _perPage < 1 || parseInt(_perPage as any) !== _perPage) {
            _perPage = 15;
        }

        this._perPage = _perPage;
    }

    get sortBy() {
        return this._sortBy;
    }

    private set sortBy(value: string | null) {
        this._sortBy = Boolean(value) ? `${value.trim()}` : null;
    }

    get sortDirection() {
        return this._sortDirection;
    }

    private set sortDirection(value: SortDirection | null) {
        if (!this._sortBy) {
            this._sortDirection = null;
            return;
        }

        const direction = value?.toLowerCase() as SortDirection | null;

        this._sortDirection = direction === "desc" ? "desc" : "asc";
    }

    get filter() {
        return this._filter;
    }

    private set filter(value: Filter | null) {
        this._filter = Boolean(value) ? (`${value}` as Filter) : null;
    }
}