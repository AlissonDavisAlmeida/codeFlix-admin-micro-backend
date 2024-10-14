import { CreateCategoryOutput } from "@core/category/application/create-category/create-category.usecase";
import { SearchCategoryUseCaseOutput } from "@core/category/application/search-category/search-category.usecase";
import { Category, CategoryConstructorProps } from "@core/category/domain/entities/category.entity";
import { Transform } from "class-transformer";
import { CollectionPresenter } from "../shared/collection.presenter";

export class CategoryPresenter {
    id: string;
    name: string;
    description: string | null;

    @Transform(({ value }: { value: Date }) => value.toISOString())
    created_at: Date;

    constructor(output: CreateCategoryOutput | Category) {

        if (output instanceof Category) {
            this.id = output.category_id.id;
            this.name = output.name;
            this.description = output.description;
            this.created_at = output.created_at;
        } else {


            this.id = output.id;
            this.name = output.name;
            this.description = output.description;
            this.created_at = output.created_at;
        }
    }
}


export class CategoryCollectionPresenter extends CollectionPresenter {
    data: CategoryPresenter[];

    constructor(output: SearchCategoryUseCaseOutput) {
        const { items, ...paginationProps } = output;
        super(paginationProps);
        this.data = items.map((category) => new CategoryPresenter(mapperToCategory(category)));
    }
}

function mapperToCategory(output: CategoryConstructorProps) {
    return new Category(output);
}
