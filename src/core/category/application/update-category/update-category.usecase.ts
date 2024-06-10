import { IUseCase } from "../../../shared/application/use-case.interface";
import { EntityNotFoundError } from "../../../shared/domain/error/entity-not-found.error";
import { EntityValidationError } from "../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { CategoryRepository } from "../../data/category.repository";
import { Category } from "../../domain/entities/category.entity";

export type UpdateCategoryInput = {
    id: string;
    name?: string;
    description?: string;
    is_active?: boolean;
}

export type UpdateCategoryOutput = {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: Date;
}


export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput> {
    constructor(private readonly categoryRepository: CategoryRepository){} 
    
    async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
        const uuid = new Uuid(input.id);

        const category = await this.categoryRepository.findById(uuid);

        if(!category){
            throw new EntityNotFoundError(input.id, Category);
        }

        input.name && category.changeName(input.name);
        input.description && category.changeDescription(input.description);
        input.is_active ? category.activate() : category.deactivate();

        if(category.notification.hasErrors()){
            throw new EntityValidationError(category.notification.toJSON());
        }


        await this.categoryRepository.update(category);

        return {
            id: category.category_id.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at
        };
    }
}