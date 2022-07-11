import { Category } from "./category";


describe("Category unit test", () => {

    it("should be created a new Category", () => {
        const state = {
            name: "Test",
            description: "Test",
            isActive: true,
        }

        const category = new Category(state);

        expect(category).toBeTruthy();
        expect(category.getProps()).toStrictEqual({
            name: "Test",
            description: "Test",
            isActive: true,
        })
        expect(category.id).toBe(0);
        expect(category.createdAt).toBeInstanceOf(Date);

    });

    it("Should be created a new Category with default values", () => {
        const category = new Category({ name: "Test" });

        expect(category).toBeTruthy();
        expect(category.getProps()).toStrictEqual({
            name: "Test",
            description: "",
            isActive: true,
        })
        expect(category.id).toBe(0);
        expect(category.createdAt).toBeInstanceOf(Date);
    })

})