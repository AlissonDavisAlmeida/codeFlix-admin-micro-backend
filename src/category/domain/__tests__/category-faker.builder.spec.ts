import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { CategoryFakeBuilder } from "../category-faker.builder";



describe("CategoryFakerBuilder Unit Tests", () => {

    describe("category_id and created_at props", () => {
        type PropEachType = {
            prop: keyof CategoryFakeBuilder;
            value?: any;
            fn?: keyof CategoryFakeBuilder;
        };

        const faker = CategoryFakeBuilder.aCategory();

        test.each`
        prop
        ${"category_id"}
        ${"created_at"}
        `("should throw an error when get $prop has called", ({ prop }: PropEachType) => {
            expect(() => faker[prop]).toThrowError(
                `Property ${prop} not have a factory, use 'with' methods`
            );
        });

        test.each`
            prop
            ${"_category_id"}
            ${"_created_at"}
            `("should $prop be undefined", ({ prop }: PropEachType) => {
            expect(faker[prop]).toBeUndefined();
        });

        test.each`
            prop|value|fn
            ${"category_id"}|${new Uuid()} | ${"withUuid"}
            ${"created_at"}|${new Date()} | ${"withCreatedAt"}
        `("$fn.name method", ({prop, value, fn}: PropEachType) => {
            const attribute = value;
            const $this = faker[`${fn}`](attribute);
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect($this[`_${prop}`]).toBe(attribute);

            faker[`${fn}`](() => attribute);
            const prop_as_function = $this[`_${prop}`] as () => typeof value;

            expect(prop_as_function()).toBe(attribute);
            expect(faker[prop]).toBe(attribute);
        });

        // test()
    });
});