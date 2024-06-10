import { IUseCase } from "../../../shared/application/use-case.interface";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { CategoryRepository } from "../../data/category.repository";


export type DeleteCategoryInput = {
    id: string;
}
export type DeleteCategoryOutput = {
    message: string;
    success: boolean;
}


export class DeleteCategoryUseCase implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput> {

    constructor(private readonly categoryRepository: CategoryRepository){}

    execute = async (input: DeleteCategoryInput): Promise<DeleteCategoryOutput>=> {
        const uuid = new Uuid(input.id);
        await this.categoryRepository.delete(uuid);

        return {
            message: "Category deleted successfully",
            success: true
        };
    };
}