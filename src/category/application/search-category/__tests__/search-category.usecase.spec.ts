import { PaginationOutputMapper } from "../../../../shared/application/pagination-output";
import { SearchParamsResult } from "../../../../shared/data";
import { Category } from "../../../domain/entities/category.entity";
import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { SearchCategoryUseCase, SearchCategoryUseCaseInput } from "../search-category.usecase";


type SutTypes = {
    sut: SearchCategoryUseCase
    categoryRepository: CategoryInMemoryRepository
}

const makeSut = (): SutTypes => {
    const categoryRepository = new CategoryInMemoryRepository();
    const sut = new SearchCategoryUseCase(categoryRepository);

    return { sut, categoryRepository };
};

describe("SearchCategoryUseCase unit tests", () => {


    it("should search a categories without filter and sort", async () => {
        const { sut, categoryRepository } = makeSut();
        const searchSpy = jest.spyOn(categoryRepository, "search");

        const categories = Category.fake().theCategories(50).withCreatedAt(new Date()).build();

        categoryRepository.items = categories;

        const arrange: SearchCategoryUseCaseInput[] = [
            { page: 1, per_page: 5 },
            { page: 2, per_page: 5 },
            { page: 3, per_page: 5 },
        ];

        for (const input of arrange) {
            const searchCategoryOutput = await sut.execute(input);
            expect(searchSpy).toHaveBeenCalled();

            const searchResult = new SearchParamsResult({
                items: categories.slice((input.page - 1) * input.per_page, input.per_page! * input.page),
                total: categories.length,
                current_page: input.page!,
                last_page: Math.ceil(categories.length / input.per_page!),
                per_page: input.per_page!
            });

            const output = PaginationOutputMapper.toOutput(searchResult.items, searchResult);
            expect(searchCategoryOutput).toStrictEqual(output);
        }

    });
});