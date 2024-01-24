import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category unit tests", () => {

    let validateSpy: jest.SpyInstance;

    beforeEach(() => {
        validateSpy = jest.spyOn(Category, "validate");

    });

    test("constructor", () => {
        let category = new Category({
            name: "Category 1",
        });

        expect(category.category_id).toBeDefined();
        expect(category.name).toBe("Category 1");
        expect(category.description).toBeNull();
        expect(category.is_active).toBeTruthy();
        expect(category.created_at).toBeInstanceOf(Date);

        const created_at = new Date();

        category = new Category({
            name: "Category 1",
            description: "Category 1 description",
            is_active: false,
            created_at
        });

        expect(category.category_id).toBeDefined();
        expect(category.name).toBe("Category 1");
        expect(category.description).toBe("Category 1 description");
        expect(category.is_active).toBeFalsy();
        expect(category.created_at).toBe(created_at);
    });

    describe("create command", () => {
        test("should create a category", () => {
            const category = Category.create({
                name: "Category 1"
            });

            expect(category.category_id).toBeDefined();
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe("Category 1");
            expect(category.description).toBeNull();
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });

        test("should create a category with description", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description"
            });

            expect(category.category_id).toBeDefined();
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe("Category 1");
            expect(category.description).toBe("Category 1 description");
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });

        test("should create a category with description and is_active", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description",
                is_active: false
            });

            expect(category.category_id).toBeDefined();
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe("Category 1");
            expect(category.description).toBe("Category 1 description");
            expect(category.is_active).toBeFalsy();
            expect(category.created_at).toBeInstanceOf(Date);
        });

        test("should change name", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description",
                is_active: false
            });

            expect(category.name).toBe("Category 1");
            category.changeName("Category 2");
            expect(category.name).toBe("Category 2");
            expect(validateSpy).toHaveBeenCalledTimes(2);
        });

        test("should change description", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description",
                is_active: false
            });

            expect(category.description).toBe("Category 1 description");
            category.changeDescription("Category 2 description");
            expect(category.description).toBe("Category 2 description");
            expect(validateSpy).toHaveBeenCalledTimes(2);
        });

        test("should activate", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description",
                is_active: false
            });

            expect(category.is_active).toBeFalsy();
            category.activate();
            expect(category.is_active).toBeTruthy();
        });

        test("should deactivate", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description",
                is_active: true
            });

            expect(category.is_active).toBeTruthy();
            category.deactivate();
            expect(category.is_active).toBeFalsy();
        });

        describe("category_id field", () => {
            const arrange = [
                { category_id: null },
                { category_id: undefined },
                { category_id: new Uuid() }
            ];

            test.each(arrange)("id=%j", ({ category_id }) => {
                const category = new Category({
                    name: "Category 1",
                    category_id: category_id as any
                });

                expect(category.category_id).toBeInstanceOf(Uuid);

            });
        });



    });

    describe("update command", ()=>{
        test("should update a name and description", ()=>{
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description",
                is_active: true
            });

            expect(category.name).toBe("Category 1");
            expect(category.description).toBe("Category 1 description");

            category.update({
                name: "Category 2",
                description: "Category 2 description"
            });

            expect(category.name).toBe("Category 2");
            expect(category.description).toBe("Category 2 description");
            expect(validateSpy).toHaveBeenCalledTimes(2);
        });
    });
});

describe("Category Validator", () => {
    describe("create command", () => {
        test("should an invalid Category with name property", () => {
            expect(() => Category.create({
                name: ""
            })).containsErrorMessage({
                name: ["name should not be empty"]
            });

            expect(() => Category.create({
                name: null
            })).containsErrorMessage({
                name: ["name should not be empty", "name must be a string", "name must be shorter than or equal to 255 characters"]
            });

            expect(() => Category.create({
                name: "a".repeat(256)
            })).containsErrorMessage({
                name: ["name must be shorter than or equal to 255 characters"]
            });

            expect(() => Category.create({
                name: 1 as any
            })).containsErrorMessage({
                name: ["name must be a string", "name must be shorter than or equal to 255 characters"]
            });
        });

        test("should an invalid Category with description property", () => {
            expect(() => Category.create({
                name: "Category 1",
                description: 1 as any
            })).containsErrorMessage({
                description: ["description must be a string"]
            });
        });

        test("should an invalid Category with is_active property", () => {
            expect(() => Category.create({
                name: "Category 1",
                is_active: 1 as any
            })).containsErrorMessage({
                is_active: ["is_active must be a boolean value"]
            });
        });
    });

    describe("changeName method", () => {
        test("should an invalid Category with name property", () => {
            const category = Category.create({
                name: "Category 1"
            });

            expect(() => category.changeName("")).containsErrorMessage({
                name: ["name should not be empty"]
            });

            expect(() => category.changeName(null as any)).containsErrorMessage({
                name: ["name should not be empty", "name must be a string", "name must be shorter than or equal to 255 characters"]
            });

            expect(() => category.changeName("a".repeat(256))).containsErrorMessage({
                name: ["name must be shorter than or equal to 255 characters"]
            });

            expect(() => category.changeName(1 as any)).containsErrorMessage({
                name: ["name must be a string", "name must be shorter than or equal to 255 characters"]
            });
        });
    });

    describe("changeDescription method", () => {
        test("should an invalid Category with description property", () => {
            const category = Category.create({
                name: "Category 1"
            });

            expect(() => category.changeDescription(1 as any)).containsErrorMessage({
                description: ["description must be a string"]
            });
        });
    });

    describe("update command", () => {
        test("should an invalid Category with name property", () => {
            const category = Category.create({
                name: "Category 1"
            });

            expect(() => category.update({
                name: ""
            })).containsErrorMessage({
                name: ["name should not be empty"]
            });

            expect(() => category.update({
                name: null
            })).containsErrorMessage({
                name: ["name should not be empty", "name must be a string", "name must be shorter than or equal to 255 characters"]
            });

            expect(() => category.update({
                name: "a".repeat(256)
            })).containsErrorMessage({
                name: ["name must be shorter than or equal to 255 characters"]
            });

            expect(() => category.update({
                name: 1 as any
            })).containsErrorMessage({
                name: ["name must be a string", "name must be shorter than or equal to 255 characters"]
            });
        });

        test("should an invalid Category with description property", () => {
            const category = Category.create({
                name: "Category 1"
            });

            expect(() => category.update({
                name: "Category 1",
                description: 1 as any
            })).containsErrorMessage({
                description: ["description must be a string"]
            });
        });
    });
});