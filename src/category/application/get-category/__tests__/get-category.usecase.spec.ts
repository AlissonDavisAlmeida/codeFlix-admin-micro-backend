import { EntityNotFoundError } from "../../../../shared/domain/error/entity-not-found.error";
import { InvalidUuidError, Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/entities/category.entity";
import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { GetCategoryInput, GetCategoryUseCase } from "../get-category.usecase";


type SutTypes = {
    sut: GetCategoryUseCase
    categoryRepository: CategoryInMemoryRepository
}

const makeSut = (): SutTypes => {
    const categoryRepository = new CategoryInMemoryRepository();
    const sut: GetCategoryUseCase = new GetCategoryUseCase(categoryRepository);

    return { sut, categoryRepository };
};

describe("GetCategoryUseCase unit tests", () => {

    it("should throw error if category does not exist", async () => {
        const { sut } = makeSut();

        const getCategoryInput: GetCategoryInput = {
            id: new Uuid().id
        };

        await expect(() => sut.execute({ id: "invalid_id" })).rejects.toThrow(new InvalidUuidError());

        try {
            await sut.execute(getCategoryInput);
        } catch (error: any) {
            expect(error).toEqual(new EntityNotFoundError(getCategoryInput.id, Category));
        }
    });
    it("should find a category", async () => {
        const { sut, categoryRepository } = makeSut();
        const findSpy = jest.spyOn(categoryRepository, "findById");

        const category = Category.create({
            name: "any_name",
            description: "any_description"
        });

        categoryRepository.items = [category];

        const deleteCategoryInput: GetCategoryInput = {
            id: category.category_id.id
        };

        const {category: getCategoryOutput} = await sut.execute(deleteCategoryInput);

        expect(findSpy).toHaveBeenCalled();
        expect(getCategoryOutput).toStrictEqual(category);

    });
});