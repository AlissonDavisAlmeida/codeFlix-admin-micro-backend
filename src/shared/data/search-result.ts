import { ValueObject } from "../domain/value-objects/value-object";
import { Entity } from "../entity";

export type SearchParamsResultProps<E extends Entity> = {
    items: E[];
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
}

export class SearchParamsResult<E extends Entity> extends ValueObject {
    readonly items: E[];
    readonly total: number;
    readonly current_page: number;
    readonly per_page: number;
    readonly last_page: number;

    constructor(props: SearchParamsResultProps<E>) {
        super();
        this.items = props.items;
        this.total = props.total;
        this.current_page = props.current_page;
        this.per_page = props.per_page;
        this.last_page = Math.ceil(props.total / props.per_page);
    }

    toJSON(forceEntity = false) {
        return {
            items: forceEntity ? this.items.map(item => item.toJSON()) : this.items,
            total: this.total,
            current_page: this.current_page,
            per_page: this.per_page,
            last_page: this.last_page,
        };
    }
}