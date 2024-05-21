import { IUseCase } from "../../../shared/application/use-case.interface";
import { CategoryRepository } from "../../data/category.repository";
import { Category } from "../../domain/entities/category.entity";

export class CreateCategoryUseCase implements IUseCase<CreateCategoryInput, CreateCategoryOutput> {

    constructor(private categoryRepository: CategoryRepository) { }


    async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
        const entity = Category.create(input);

        await this.categoryRepository.insert(entity);

        return {
            id: entity.category_id.id,
            is_active: entity.is_active,
            created_at: entity.created_at,
            name: entity.name,
            description: entity.description
        };
    }
}

export type CreateCategoryInput = {
    name: string
    description?: string | null
    is_active?: boolean
}

export type CreateCategoryOutput = {
    id: string
    name: string
    description?: string | null
    is_active: boolean
    created_at: Date
}