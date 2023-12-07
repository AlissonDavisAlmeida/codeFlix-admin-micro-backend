import { Uuid } from "../../../shared/domain/value-objects/uuid.vo"
import { Category } from "../category.entity"

describe("Category unit tests", () => {

    test("constructor", () => {
        let category = new Category({
            name: "Category 1",
        })

        expect(category.category_id).toBeDefined()
        expect(category.name).toBe("Category 1")
        expect(category.description).toBeNull()
        expect(category.is_active).toBeTruthy()
        expect(category.created_at).toBeInstanceOf(Date)

        const created_at = new Date()

        category = new Category({
            name: "Category 1",
            description: "Category 1 description",
            is_active: false,
            created_at
        })

        expect(category.category_id).toBeDefined()
        expect(category.name).toBe("Category 1")
        expect(category.description).toBe("Category 1 description")
        expect(category.is_active).toBeFalsy()
        expect(category.created_at).toBe(created_at)
    })

    describe("create command", () => {
        test("should create a category", () => {
            const category = Category.create({
                name: "Category 1"
            })

            expect(category.category_id).toBeDefined()
            expect(category.category_id).toBeInstanceOf(Uuid)
            expect(category.name).toBe("Category 1")
            expect(category.description).toBeNull()
            expect(category.is_active).toBeTruthy()
            expect(category.created_at).toBeInstanceOf(Date)
        })

        test("should create a category with description", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description"
            })

            expect(category.category_id).toBeDefined()
            expect(category.category_id).toBeInstanceOf(Uuid)
            expect(category.name).toBe("Category 1")
            expect(category.description).toBe("Category 1 description")
            expect(category.is_active).toBeTruthy()
            expect(category.created_at).toBeInstanceOf(Date)
        })

        test("should create a category with description and is_active", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description",
                is_active: false
            })

            expect(category.category_id).toBeDefined()
            expect(category.category_id).toBeInstanceOf(Uuid)
            expect(category.name).toBe("Category 1")
            expect(category.description).toBe("Category 1 description")
            expect(category.is_active).toBeFalsy()
            expect(category.created_at).toBeInstanceOf(Date)
        })

        test("should change name", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description",
                is_active: false
            })

            expect(category.name).toBe("Category 1")
            category.changeName("Category 2")
            expect(category.name).toBe("Category 2")
        })

        test("should change description", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description",
                is_active: false
            })

            expect(category.description).toBe("Category 1 description")
            category.changeDescription("Category 2 description")
            expect(category.description).toBe("Category 2 description")
        })

        test("should activate", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description",
                is_active: false
            })

            expect(category.is_active).toBeFalsy()
            category.activate()
            expect(category.is_active).toBeTruthy()
        })

        test("should deactivate", () => {
            const category = Category.create({
                name: "Category 1",
                description: "Category 1 description",
                is_active: true
            })

            expect(category.is_active).toBeTruthy()
            category.deactivate()
            expect(category.is_active).toBeFalsy()
        })

        describe("category_id field", () => {
            const arrange = [
                { category_id: null },
                { category_id: undefined },
                { category_id: new Uuid() }
            ]

            test.each(arrange)("id=%j", ({ category_id }) => {
                const category = new Category({
                    name: "Category 1",
                    category_id: category_id as any
                })

                expect(category.category_id).toBeInstanceOf(Uuid)

            })
        })


    })
})