import { EntityNotFoundError } from "../../../../shared/domain/error/entity-not-found.error";
import { InvalidUuidError, Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { Category } from "../../../domain/entities/category.entity";
import { CategoryRepositorySequelize } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { DeleteCategoryInput, DeleteCategoryOutput, DeleteCategoryUseCase } from "../delete-category.usecase";

type SutTypes = {
    sut: DeleteCategoryUseCase
    categoryRepository: CategoryRepositorySequelize
}

const makeSut = (): SutTypes => {
    const categoryRepository = new CategoryRepositorySequelize(CategoryModel);
    const sut: DeleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

    return { sut, categoryRepository };
};
describe("DeleteCategoryUseCase integration tests", () => {
    
    setupSequelize({
        models: [CategoryModel],
        storage: ":memory:"
    });

    it("should throw error if category does not exist", async () => {
        const { sut } = makeSut();

        const deleteCategoryInput: DeleteCategoryInput = {
            id: new Uuid().id
        };

        await expect(() => sut.execute({ id: "invalid_id" })).rejects.toThrow(new InvalidUuidError());

        try {
            await sut.execute(deleteCategoryInput);
        } catch (error: any) {
            expect(error).toEqual(new EntityNotFoundError(deleteCategoryInput.id, Category));
        }
    });

    it("should delete a category", async () => {
        const { sut, categoryRepository } = makeSut();
        
        const category = Category.fake().aCategory().build();
        
        await categoryRepository.insert(category);


        const deleteCategoryInput: DeleteCategoryInput = {
            id: category.category_id.id
        };

        const createCategoryOutput: DeleteCategoryOutput = await sut.execute(deleteCategoryInput);

        const categoryDeleted = await categoryRepository.findById(new Uuid(deleteCategoryInput.id));

        expect(createCategoryOutput.success).toBe(true);
        expect(categoryDeleted).toBeNull();

    });
});