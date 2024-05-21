import { InvalidUuidError, Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { Category } from "../../../domain/entities/category.entity";
import { CategoryRepositorySequelize } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { UpdateCategoryInput, UpdateCategoryOutput, UpdateCategoryUseCase } from "../update-category.usecase";

type SutTypes = {
    sut: UpdateCategoryUseCase
    categoryRepository: CategoryRepositorySequelize
}

const makeSut = (): SutTypes => {
    const categoryRepository = new CategoryRepositorySequelize(CategoryModel);
    const sut = new UpdateCategoryUseCase(categoryRepository);

    return { sut, categoryRepository };
};
describe("UpdateCategoryUseCase integration tests", () => {
    
    setupSequelize({
        models: [CategoryModel],
        storage: ":memory:"
    });

    it("should update a category", async () => {
        const { sut, categoryRepository } = makeSut();

        const category = Category.create({
            name: "any_name"
        });

        await categoryRepository.insert(category);

        const updateCategoryInput: UpdateCategoryInput = {
            id: category.category_id.id,
            name: "any_name"
        };

        const updateCategoryOutput: UpdateCategoryOutput = await sut.execute(updateCategoryInput);

        const categoryEntity = await categoryRepository.findById(new Uuid(updateCategoryOutput.id));

        expect(updateCategoryOutput).toStrictEqual({
            id: categoryEntity.category_id.id,
            name: categoryEntity.name,
            created_at: categoryEntity.created_at,
            description: categoryEntity.description,
            is_active: categoryEntity.is_active,
        });

    });

    it("should throw an error when category does not exist", async () => {
        const { sut } = makeSut();

        const updateCategoryInput: UpdateCategoryInput = {
            id: "any_id",
            name: "any_name"
        };

        await expect(sut.execute(updateCategoryInput)).rejects.toThrowError(new InvalidUuidError());
    });
});