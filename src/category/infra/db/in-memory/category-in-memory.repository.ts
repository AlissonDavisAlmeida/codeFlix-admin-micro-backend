import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { ApplyFilterProps, ApplySortProps, InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { Category, CategoryConstructorProps } from "../../../domain/category.entity";

type KeyCategoryConstructorProps = keyof CategoryConstructorProps;



export class CategoryInMemoryRepository extends InMemorySearchableRepository<Category, Uuid, string, KeyCategoryConstructorProps> {

    sortableFields: Set<KeyCategoryConstructorProps> = new Set(["name", "created_at"]);

    protected async applyFilter(props: ApplyFilterProps<Category, string>): Promise<Category[]> {
        if (!props.filter) {
            return props.items;
        }

        return props.items.filter((category) =>
            category.name?.toLowerCase().includes(props.filter.toLowerCase()) ||
            category.description?.toLowerCase().includes(props.filter.toLowerCase())
        );
    }

    async applySort(props: ApplySortProps<Category, KeyCategoryConstructorProps>): Promise<Category[]> {
        return props.sortBy ?
            super.applySort(props) :
            super.applySort({
                ...props,
                sortBy: "created_at",
                sortDirection: "desc"
            });
    }

    constructor() {
        super();
    }


    getEntity(): new (...args: any[]) => Category {
        return Category;
    }


}
