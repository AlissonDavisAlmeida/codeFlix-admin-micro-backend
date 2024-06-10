import { InvalidUuidError } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/entities/category.entity";
import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { UpdateCategoryInput, UpdateCategoryUseCase } from "../update-category.usecase";


type SutTypes = {
    sut: UpdateCategoryUseCase
    categoryRepository: CategoryInMemoryRepository
}

const makeSut = (): SutTypes => {
    const categoryRepository = new CategoryInMemoryRepository();
    const sut = new UpdateCategoryUseCase(categoryRepository);

    return { sut, categoryRepository };
};

describe("UpdateCategoryUseCase unit tests", () => {

    it("should update a category", async () => {
        const { sut, categoryRepository } = makeSut();
        const insertSpy = jest.spyOn(categoryRepository, "update");

        const category = Category.create({
            name: "any_name"
        });

        await categoryRepository.insert(category);


        const updateCategoryInput: UpdateCategoryInput = {
            id: category.category_id.id,
            name: "any_name"
        };

        const updateCategoryOutput = await sut.execute(updateCategoryInput);

        expect(insertSpy).toHaveBeenCalled();
        expect(updateCategoryOutput).toStrictEqual({
            id: categoryRepository.items[0].category_id.id,
            name: categoryRepository.items[0].name,                     
            created_at: categoryRepository.items[0].created_at,
            description: categoryRepository.items[0].description,
            is_active: categoryRepository.items[0].is_active,
        });
    });

    it("should throw an error when category does not exist", async () => {
        const { sut } = makeSut();

        const updateCategoryInput: UpdateCategoryInput = {
            id: "any_id",
            name: "any_name"
        };

        await expect(sut.execute(updateCategoryInput)).rejects.toThrow(new InvalidUuidError());
    });
});