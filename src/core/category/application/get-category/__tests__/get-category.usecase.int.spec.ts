import { EntityNotFoundError } from "../../../../shared/domain/error/entity-not-found.error";
import { InvalidUuidError, Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { Category } from "../../../domain/entities/category.entity";
import { CategoryRepositorySequelize } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { GetCategoryInput, GetCategoryOutput, GetCategoryUseCase } from "../get-category.usecase";

type SutTypes = {
    sut: GetCategoryUseCase
    categoryRepository: CategoryRepositorySequelize
}

const makeSut = (): SutTypes => {
    const categoryRepository = new CategoryRepositorySequelize(CategoryModel);
    const sut: GetCategoryUseCase = new GetCategoryUseCase(categoryRepository);

    return { sut, categoryRepository };
};
describe("GetCategoryUseCase integration tests", () => {

    setupSequelize({
        models: [CategoryModel],
        storage: ":memory:"
    });

    it("should throw error if category does not exist", async () => {
        const { sut } = makeSut();

        const getCategoryInput: GetCategoryInput = {
            id: new Uuid().id
        };

        await expect(() => sut.execute({ id: "invalid_id" })).rejects.toThrow(new InvalidUuidError());


        await expect(() => sut.execute(getCategoryInput)).rejects.toThrow(new EntityNotFoundError(getCategoryInput.id, Category));

    });

    it("should delete a category", async () => {
        const { sut, categoryRepository } = makeSut();

        const category = Category.fake().aCategory().build();

        await categoryRepository.insert(category);


        const getCategoryInput: GetCategoryInput = {
            id: category.category_id.id
        };

        const { category: getCategoryOutput }: GetCategoryOutput = await sut.execute(getCategoryInput);


        expect(getCategoryOutput).toStrictEqual(category);

    });
});