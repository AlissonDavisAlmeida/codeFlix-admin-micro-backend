import { IUseCase } from "../../../shared/application/use-case.interface";
import { EntityNotFoundError } from "../../../shared/domain/error/entity-not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { CategoryRepository } from "../../data/category.repository";
import { Category } from "../../domain/entities/category.entity";


export type GetCategoryInput = {
    id: string;
}
export type GetCategoryOutput = {
    category: Category | null;
}


export class GetCategoryUseCase implements IUseCase<GetCategoryInput, GetCategoryOutput> {

    constructor(private readonly categoryRepository: CategoryRepository){}

    execute = async (input: GetCategoryInput): Promise<GetCategoryOutput>=> {
        const uuid = new Uuid(input.id);
        const category = await this.categoryRepository.findById(uuid);

        if(!category) {
            throw new EntityNotFoundError(uuid.id, Category);
        }
        
        return {
            category
        };
    };
}