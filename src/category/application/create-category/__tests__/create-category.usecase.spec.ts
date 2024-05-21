import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { CreateCategoryInput, CreateCategoryUseCase } from "../create-category.usecase";


type SutTypes = {
    sut: CreateCategoryUseCase
    categoryRepository: CategoryInMemoryRepository
}

const makeSut = (): SutTypes => {
    const categoryRepository = new CategoryInMemoryRepository();
    const sut: CreateCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

    return { sut, categoryRepository };
};

describe("CreateCategoryUseCase unit tests", () => {

    it("should create a category", async () => {
        const { sut, categoryRepository } = makeSut();
        const insertSpy = jest.spyOn(categoryRepository, "insert");
        const createCategoryInput: CreateCategoryInput = {
            name: "any_name"
        };

        const createCategoryOutput = await sut.execute(createCategoryInput);

        expect(insertSpy).toHaveBeenCalled();
        expect(createCategoryOutput).toStrictEqual({
            id: categoryRepository.items[0].category_id.id,
            name: categoryRepository.items[0].name,                     
            created_at: categoryRepository.items[0].created_at,
            description: categoryRepository.items[0].description,
            is_active: categoryRepository.items[0].is_active,
        });
    });
});