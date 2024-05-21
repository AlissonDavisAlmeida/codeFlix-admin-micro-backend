import { faker } from "@faker-js/faker/locale/pt_BR";
import { Category } from "../../../domain/entities/category.entity";
import { CategoryInMemoryRepository } from "./category-in-memory.repository";

describe("CategoryInMemory repository unit tests", () => {
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
    });

    it("should no filter items when filter object is null", async () => {
        const category = Category.fake().aCategory().build();
        const items = [category];
        const filterItemsSpy = jest.spyOn(items, "filter");

        const itemsFiltered = await repository["applyFilter"]({ items, filter: null });
        expect(itemsFiltered).toStrictEqual(items);
        expect(filterItemsSpy).not.toHaveBeenCalled();
    });

    it("should filter items using filter parameter", async () => {
        const category1 = Category.fake().aCategory().withName(faker.person.firstName() + "_teste").build();
        const category2 = Category.fake().aCategory().withName(faker.person.firstName() + "_TESTE").build();
        const category3 = Category.fake().aCategory().build();
        const items = [category1, category2, category3];
        const filterItemsSpy = jest.spyOn(items, "filter");

        const itemsFiltered = await repository["applyFilter"]({ items, filter: "teste" });

        expect(itemsFiltered).toStrictEqual([category1, category2]);
        expect(filterItemsSpy).toHaveBeenCalled();
    });

    it("should sort items by created_at desc when sortBy is null", async () => {
        const created_at = new Date();

        const category1 = Category.fake().aCategory().withCreatedAt(created_at).build();
        const category2 = Category.fake().aCategory().withCreatedAt(new Date(created_at.getTime() + 1000)).build();
        const category3 = Category.fake().aCategory().withCreatedAt(new Date(created_at.getTime() + 2000)).build();
        const items = [category1, category2, category3];
        const applySortSpy = jest.spyOn(repository, "applySort");

        const itemsSorted = await repository["applySort"]({ items, sortBy: null, sortDirection: "asc" });

        expect(itemsSorted).toStrictEqual([category3, category2, category1]);
        expect(applySortSpy).toHaveBeenCalled();
    });

    it("should sort items by name", async () => {
        const category1 = Category.fake().aCategory().withName("B").build();
        const category2 = Category.fake().aCategory().withName("C").build();
        const category3 = Category.fake().aCategory().withName("A").build();
        const items = [category1, category2, category3];
        const applySortSpy = jest.spyOn(repository, "applySort");

        const itemsSorted = await repository["applySort"]({ items, sortBy: "name", sortDirection: "asc" });

        expect(itemsSorted).toStrictEqual([category3, category1, category2]);
        expect(applySortSpy).toHaveBeenCalled();
    });
});

