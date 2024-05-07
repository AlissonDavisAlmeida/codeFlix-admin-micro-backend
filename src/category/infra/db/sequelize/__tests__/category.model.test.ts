import { DataType } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("CategoryModel integration tests", () => {
   
    
    setupSequelize({
        storage: ":memory:",
        models: [CategoryModel]
    });

    test("mapping props", async () => {
        const attributesMap = CategoryModel.getAttributes();
        const attributes = Object.keys(CategoryModel.getAttributes());

        expect(attributes).toStrictEqual([
            "category_id",
            "created_at",
            "description",
            "is_active",
            "name"
        ]);

        const categoryIdAttr = attributesMap.category_id;
        expect(categoryIdAttr).toMatchObject({
            field: "category_id",
            fieldName: "category_id",
            primaryKey: true,
            type: DataType.UUID()
        });

        const nameAttr = attributesMap.name;
        expect(nameAttr).toMatchObject({
            field: "name",
            fieldName: "name",
            allowNull: false,
            type: DataType.STRING(255)
        });

        const descriptionAttr = attributesMap.description;
        expect(descriptionAttr).toMatchObject({
            field: "description",
            fieldName: "description",
            allowNull: true,
            type: DataType.TEXT()
        });

        const isActiveAttr = attributesMap.is_active;
        expect(isActiveAttr).toMatchObject({
            field: "is_active",
            fieldName: "is_active",
            type: DataType.BOOLEAN()
        });

        const createdAtAttr = attributesMap.created_at;
        expect(createdAtAttr).toMatchObject({
            field: "created_at",
            fieldName: "created_at",
            type: DataType.DATE(3)
        });
    });

    test("create", async () => {
        const category = Category.fake().aCategory().build();

        const createdCategory = await CategoryModel.create({
            category_id: category.category_id.id,
            created_at: category.created_at,
            description: category.description,
            is_active: category.is_active,
            name: category.name
        });

        expect(createdCategory.toJSON()).toStrictEqual(category.toJSON());
    });
});