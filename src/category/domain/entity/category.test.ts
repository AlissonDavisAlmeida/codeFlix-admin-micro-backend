import { Category, CategoryState } from "./category";
import { omit } from "lodash"
import { UniqueIdentity } from "../../../@seedwork/domain/unique_identity";

describe("Category unit test", () => {

    it("should be created a new Category", () => {
        const state = {
            name: "Test",
            description: "Test",
            isActive: true,
        }

        const category = new Category(state);

        expect(category).toBeTruthy();

        let props = omit(category.getProps(), ["createdAt"]);

        expect(props).toStrictEqual({
            name: "Test",
            description: "Test",
            isActive: true,
        })
        expect(category.id).toBeDefined();
        expect(category.createdAt).toBeInstanceOf(Date);

    });

    it("should be created a new Category with default values", () => {
        const category = new Category({ name: "Test" });

        expect(category).toBeTruthy();

        let props = omit(category.getProps(), ["createdAt"]);

        expect(props).toStrictEqual({
            name: "Test",
            description: null,
            isActive: true,
        })
        expect(category.createdAt).toBeInstanceOf(Date);
    })

    it("getter of name field", () => {
        const category = new Category({ name: "Test" });

        expect(category.name).toBe("Test");
    })

    it("getter and setter of description field", () => {
        let category = new Category({ name: "Test", description: "Test" });

        expect(category.description).toBe("Test");

        category = new Category({ name: "Test" });

        expect(category.description).toBe(null);

        category = new Category({ name: "Test", description: "Test", isActive: true });

        category["Description"] = "Test2";

        expect(category.description).toBe("Test2");

        category["Description"] = null;

        expect(category.description).toBeNull();
    })

    it("have id field", () => {

        type CategoryData = { props: CategoryState, id?: UniqueIdentity }

        const data: CategoryData[] = [
            { props: { name: "Test" } },
            { props: { name: "Test", description: "Test" }, id: new UniqueIdentity() },
            { props: { name: "Test", description: "Test", isActive: true }, id: null },
            { props: { name: "Test", description: "Test", isActive: true }, id: undefined },
        ]

        data.forEach(item => {
            const category = new Category(item.props, item.id);

            expect(category.id).toBeDefined();
            expect(category.id).toBeInstanceOf(UniqueIdentity);
        })


    })

    it("getter and setter of isActive field", () => {
        let category = new Category({ name: "Test", isActive: true });

        expect(category.isActive).toBe(true);

        category = new Category({ name: "Test" });

        expect(category.isActive).toBe(true);

        category = new Category({ name: "Test", isActive: false });

        expect(category.isActive).toBe(false);
    })

    it("getter of createdAt field", () => {
        let category = new Category({ name: "Test" });

        expect(category.createdAt).toBeInstanceOf(Date);

        const createdAt = new Date();

        category = new Category({ name: "Test", createdAt });

        expect(category.createdAt).toBe(createdAt);
    })
})