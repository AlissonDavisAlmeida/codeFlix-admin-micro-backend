import { CreateCategoryOutput } from "@core/category/application/create-category/create-category.usecase";
import { Category } from "@core/category/domain/entities/category.entity";
import { Transform } from "class-transformer";

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