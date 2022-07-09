import { Category } from "./category";


describe("Category unit test", () => {

    it("should be created a new Category", () => {
        const category = new Category({ name: "test", description: "test", isActive: true });

        
        expect(category).toBeTruthy();
        expect(category.name).toBe("test");
        expect(category.description).toBe("test");
        expect(category.isActive).toBe(true);

    });

})