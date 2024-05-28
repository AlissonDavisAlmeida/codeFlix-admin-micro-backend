import { EntityNotFoundError } from "../../../../shared/domain/error/entity-not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/entities/category.entity";
import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { DeleteCategoryInput, DeleteCategoryUseCase } from "../delete-category.usecase";


type SutTypes = {
    sut: DeleteCategoryUseCase
    categoryRepository: CategoryInMemoryRepository
}

const makeSut = (): SutTypes => {
    const categoryRepository = new CategoryInMemoryRepository();
    const sut: DeleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

    return { sut, categoryRepository };
};

describe("CreateCategoryUseCase unit tests", () => {

    it("should throw error if category does not exist", async () => {
        const { sut } = makeSut();

        const deleteCategoryInput: DeleteCategoryInput = {
            id: new Uuid().id
        };

        try {
            await sut.execute(deleteCategoryInput);
        } catch (error: any) {
            expect(error).toEqual(new EntityNotFoundError(deleteCategoryInput.id, Category));
        }
    });
    it("should delete a category", async () => {
        const { sut, categoryRepository } = makeSut();
        const deleteSpy = jest.spyOn(categoryRepository, "delete");

        const category = Category.create({
            name: "any_name",
            description: "any_description"
        });

        categoryRepository.items = [category];

        const deleteCategoryInput: DeleteCategoryInput = {
            id: category.category_id.id
        };

        const deleteCategoryOutput = await sut.execute(deleteCategoryInput);

        expect(deleteSpy).toHaveBeenCalled();
        expect(deleteCategoryOutput.success).toBe(true);
        
    });
});