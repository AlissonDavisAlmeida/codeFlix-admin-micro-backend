import { isBoolean } from "lodash";
import { ValueObject } from "../domain/value-objects/value-object";

export type SortDirection = "asc" | "desc";

export type SearchParamsInputConstructorProps<Filter = string, SortBy = string> = {
    page?: number;
    per_page?: number;
    sort_by?: SortBy | null;
    sort_direction?: SortDirection | null;
    filter?: Filter | null;
}


export class SearchParamsInput<Filter = string, SortBy = string> extends ValueObject {
    protected _page: number;
    protected _perPage: number = 15;
    protected _sortBy: SortBy | null;
    protected _sortDirection: SortDirection | null;
    protected _filter: Filter | null;

    constructor(props: SearchParamsInputConstructorProps<Filter, SortBy> = {}) {
        super();
        this.page = props.page;
        this.perPage = props.per_page;
        this.sortBy = props.sort_by;
        this.sortDirection = props.sort_direction;
        this.filter = props.filter;
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
        // if value is a boolean, can't be converted to a number
        let _perPage = isBoolean(value) ? 15 : +value;

        if (Number.isNaN(_perPage) || _perPage < 1 || parseInt(_perPage as any) !== _perPage) {
            _perPage = 15;
        }

        this._perPage = _perPage;
    }

    get sortBy(): SortBy | null{
        return this._sortBy;
    }

    private set sortBy(value: SortBy | null) {
        this._sortBy =
            (value === "" || value === null || value === undefined) ? null : `${value}`.trim() as SortBy | null;
    }

    get sortDirection() {
        return this._sortDirection;
    }

    private set sortDirection(value: SortDirection | null) {
        if (!this._sortBy) {
            this._sortDirection = null;
            return;
        }

        const direction = `${value}`.toLowerCase() as SortDirection;

        this._sortDirection = direction === "desc" ? "desc" : "asc";
    }

    get filter() {
        return this._filter;
    }

    private set filter(value: Filter | null) {
        this._filter = (value === "" || value === null || value === undefined) ? null : (`${value}` as Filter);
    }
}