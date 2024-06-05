import { PaginationOutputMapper } from "../../../../shared/application/pagination-output";
import { SearchParamsResult } from "../../../../shared/data";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { Category } from "../../../domain/entities/category.entity";
import { CategoryRepositorySequelize } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { SearchCategoryUseCase, SearchCategoryUseCaseInput } from "../search-category.usecase";

type SutTypes = {
    sut: SearchCategoryUseCase
    categoryRepository: CategoryRepositorySequelize
}

type ArrangeType = {
    searchInput: SearchCategoryUseCaseInput;
    itemsResult?: Category[];

}

const makeSut = (): SutTypes => {
    const categoryRepository = new CategoryRepositorySequelize(CategoryModel);
    const sut: SearchCategoryUseCase = new SearchCategoryUseCase(categoryRepository);

    return { sut, categoryRepository };
};
describe("GetCategoryUseCase integration tests", () => {

    setupSequelize({
        models: [CategoryModel],
        storage: ":memory:"
    });

    

    it("should search a categories without filter and sort", async () => {
        const { sut, categoryRepository } = makeSut();
        const searchSpy = jest.spyOn(categoryRepository, "search");

        const categories = Category.fake().theCategories(50).withCreatedAt(new Date()).build();

        await categoryRepository.bulkInsert(categories);

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

    it("should search a categories with sort", async () => {
        const { sut, categoryRepository } = makeSut();
        const searchSpy = jest.spyOn(categoryRepository, "search");

        const categories = [
            Category.fake().aCategory().withName("a").build(),
            Category.fake().aCategory().withName("c").build(),
            Category.fake().aCategory().withName("b").build(),
            Category.fake().aCategory().withName("e").build(),
            Category.fake().aCategory().withName("d").build(),
        ];

        await categoryRepository.bulkInsert(categories);

        const arrange: ArrangeType[] = [
            { searchInput:{page: 1, per_page: 2, sort_by: "name", sort_direction: "asc"}, itemsResult: [categories[0], categories[2]] },
            { searchInput:{page: 2, per_page: 2, sort_by: "name", sort_direction: "asc"}, itemsResult: [categories[1], categories[4]] },
            { searchInput:{page: 3, per_page: 2, sort_by: "name", sort_direction: "asc"}, itemsResult: [categories[3]]  },
        ];

        for (const input of arrange) {
            const {searchInput, itemsResult} = input;
            const searchCategoryOutput = await sut.execute(searchInput);
            expect(searchSpy).toHaveBeenCalled();
            
            const searchResult = new SearchParamsResult({
                items: itemsResult,
                total: 5,
                current_page: searchInput.page!,
                last_page: Math.ceil(categories.length / searchInput.per_page!),
                per_page: searchInput.per_page!
            });

            const output = PaginationOutputMapper.toOutput(searchResult.items, searchResult);
            expect(searchCategoryOutput).toStrictEqual(output);
        }
    });
});