import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { CategoryRepositorySequelize } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { CreateCategoryInput, CreateCategoryOutput, CreateCategoryUseCase } from "../create-category.usecase";

type SutTypes = {
    sut: CreateCategoryUseCase
    categoryRepository: CategoryRepositorySequelize
}

const makeSut = (): SutTypes => {
    const categoryRepository = new CategoryRepositorySequelize(CategoryModel);
    const sut: CreateCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

    return { sut, categoryRepository };
};
describe("CreateCategoryUseCase integration tests", () => {
    
    setupSequelize({
        models: [CategoryModel],
        storage: ":memory:"
    });

    it("should create a category", async () => {
        const { sut, categoryRepository } = makeSut();
        const createCategoryInput: CreateCategoryInput = {
            name: "any_name"
        };

        const createCategoryOutput: CreateCategoryOutput = await sut.execute(createCategoryInput);

        const categoryEntity = await categoryRepository.findById(new Uuid(createCategoryOutput.id));

        expect(createCategoryOutput).toStrictEqual({
            id: categoryEntity.category_id.id,
            name: categoryEntity.name,
            created_at: categoryEntity.created_at,
            description: categoryEntity.description,
            is_active: categoryEntity.is_active,
        });

    });
});