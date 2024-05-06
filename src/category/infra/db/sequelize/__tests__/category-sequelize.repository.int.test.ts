import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryRepositorySequelize } from "../category-sequelize.repository";
import { Category } from "../../../../domain/category.entity";
import { EntityNotFoundError } from "../../../../../shared/domain/error/entity-not-found.error";
import { CategoryModelMapper } from "../category-model-mapper";
import { CategorySearchParamsInput, CategorySearchParamsResult } from "../../../../data/category.repository";
import { SearchParamsResultProps } from "../../../../../shared/data";

describe("CategorySequelizeRepository integration tests", () => {
    let sequelize: Sequelize;
    let categoryRepository: CategoryRepositorySequelize;


    beforeAll(() => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            models: [CategoryModel]
        });
    });

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        categoryRepository = new CategoryRepositorySequelize(CategoryModel);
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should insert a new category", async () => {
        const category = Category.fake().aCategory().build();

        await categoryRepository.insert(category);

        const model = await CategoryModel.findByPk(category.category_id.id);

        expect(model).not.toBeNull();
        expect(model.toJSON()).toStrictEqual(category.toJSON());

    });

    it("should finds a entity by id", async () => {
        const category = Category.fake().aCategory().build();
        await categoryRepository.insert(category);

        const found = await categoryRepository.findById(category.category_id);

        expect(found).not.toBeNull();
        expect(found).toStrictEqual(category);

        const entityNotFound = await categoryRepository.findById(Category.fake().aCategory().build().category_id);

        expect(entityNotFound).toBeNull();
    });

    it("should return all entities", async () => {
        const categories = Category.fake().theCategories(3).build();

        await categoryRepository.bulkInsert(categories);

        const categoriesFound = await categoryRepository.findAll();

        expect(categoriesFound).toHaveLength(3);
        expect(categoriesFound).toStrictEqual(categories);
    });

    it("should throw an error when trying to update a non-existing entity", async () => {
        const category = Category.fake().aCategory().build();

        await expect(categoryRepository.update(category)).rejects.toThrowError(new EntityNotFoundError(category.category_id.id, Category));
    });

    it("should update a entity", async () => {
        const category = Category.fake().aCategory().build();
        await categoryRepository.insert(category);

        category.changeName("new name");

        await categoryRepository.update(category);

        const model = await CategoryModel.findByPk(category.category_id.id);

        expect(model).not.toBeNull();
        expect(model.toJSON()).toStrictEqual(category.toJSON());
    });

    it("should throw an error when trying to delete a non-existing entity", async () => {
        const category = Category.fake().aCategory().build();

        await expect(categoryRepository.delete(category.category_id)).rejects.toThrowError(new EntityNotFoundError(category.category_id.id, Category));
    });

    it("should delete a entity", async () => {
        const category = Category.fake().aCategory().build();

        await categoryRepository.insert(category);

        await categoryRepository.delete(category.category_id);

        const model = await CategoryModel.findByPk(category.category_id.id);

        expect(model).toBeNull();
    });

    describe("Search methods", () => {
        it("should only apply paginate when other params are null", async () => {
            const created_at = new Date();
            const categories = Category.fake()
                .theCategories(16)
                .withName("category")
                .withDescription("description")
                .withCreatedAt(created_at)
                .build();

            await categoryRepository.bulkInsert(categories);

            const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");

            const searchParamsInput = new CategorySearchParamsInput();

            const searchOutput = await categoryRepository.search(searchParamsInput);

            expect(searchOutput).toBeInstanceOf(CategorySearchParamsResult);
            expect(spyToEntity).toHaveBeenCalledTimes(15);
            expect(searchOutput.toJSON()).toMatchObject<SearchParamsResultProps<Category>>({
                total: 16,
                current_page: 1,
                per_page: 15,
                items: categories.slice(0, 15),
                last_page: 2
            });

            const items = searchOutput.items.map(item => item.toJSON());
            expect(items).toMatchObject(
                new Array(15).fill({
                    name: "category",
                    description: "description",
                    is_active: true,
                    created_at: created_at
                })
            );
        });

        it("should order bt created_at DESC when search params are null", async () => {
            const created_at = new Date();
            const categories = Category.fake()
                .theCategories(16)
                .withName((index: number) => `category-${index}`)
                .withDescription("description")
                .withCreatedAt((index: number) => new Date(created_at.getTime() + index))
                .build();

            await categoryRepository.bulkInsert(categories);

            const categorySearchParamsInput = new CategorySearchParamsInput();
            const searchResult = await categoryRepository.search(categorySearchParamsInput);
            const items = searchResult.items;
            const itemsReversed = [...items].reverse();
            itemsReversed.forEach((item, index) => {
                expect(item.created_at).toEqual(categories[index + 1].created_at);
                expect(item.name).toEqual(categories[index + 1].name);
            });
        });

        it("should apply paginate and filter", async () => {
            const created_at = new Date();
            const categories = Category.fake()
                .theCategories(16)
                .withName((index: number) => `category-${index}`)
                .withDescription("description")
                .withCreatedAt(created_at)
                .build();

            await categoryRepository.bulkInsert(categories);

            const searchParamsInput = new CategorySearchParamsInput({
                page: 1,
                per_page: 5,
                filter: "5"
            });

            const searchOutput = await categoryRepository.search(searchParamsInput);

            expect(searchOutput).toBeInstanceOf(CategorySearchParamsResult);
            expect(searchOutput.toJSON(true)).toMatchObject<SearchParamsResultProps<Category>>(
                new CategorySearchParamsResult({
                    total: 2,
                    current_page: 1,
                    per_page: 5,
                    items: [categories[5], categories[15]],
                    last_page: 1
                }).toJSON(true)
            );
        });

        it("should apply paginate and sort", async () => {
            const categories = [
                Category.fake().aCategory().withName("b").build(),
                Category.fake().aCategory().withName("a").build(),
                Category.fake().aCategory().withName("d").build(),
                Category.fake().aCategory().withName("e").build(),
                Category.fake().aCategory().withName("c").build(),
            ];
            await categoryRepository.bulkInsert(categories);

            const searchParamsInput = new CategorySearchParamsInput({
                page: 1,
                per_page: 2,
                sort_by: "name",
                sort_direction: "asc"
            });

            const searchOutput = await categoryRepository.search(searchParamsInput);

            expect(searchOutput).toBeInstanceOf(CategorySearchParamsResult);
            expect(searchOutput.toJSON(true)).toMatchObject<SearchParamsResultProps<Category>>(
                new CategorySearchParamsResult({
                    total: 5,
                    current_page: 1,
                    per_page: 2,
                    items: [categories[1], categories[0]],
                    last_page: 4
                }).toJSON(true)
            );
        });

        it("should apply filter, sort and paginate", async () => {
            const categories = [
                Category.fake().aCategory().withName("b-name").build(),
                Category.fake().aCategory().withName("a-name").build(),
                Category.fake().aCategory().withName("d-name").build(),
                Category.fake().aCategory().withName("e-name").build(),
                Category.fake().aCategory().withName("c-name").build(),
            ];

            await categoryRepository.bulkInsert(categories);

            const searchParamsInput = new CategorySearchParamsInput({
                page: 1,
                per_page: 2,
                filter: "name",
                sort_by: "name",
                sort_direction: "desc"
            });

            const searchOutput = await categoryRepository.search(searchParamsInput);

            expect(searchOutput).toBeInstanceOf(CategorySearchParamsResult);
            expect(searchOutput.toJSON(true)).toMatchObject<SearchParamsResultProps<Category>>(
                new CategorySearchParamsResult({
                    total: 5,
                    current_page: 1,
                    per_page: 2,
                    items: [categories[3], categories[2]],
                    last_page: 3
                }).toJSON(true)
            );
        });

    });

});