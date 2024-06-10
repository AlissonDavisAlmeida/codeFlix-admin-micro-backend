import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model-mapper";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { Category } from "../../../../domain/entities/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("CategoryModelMapper integration tests", () => {

    setupSequelize({
        models: [CategoryModel],
        storage: ":memory:"
    
    });

    

    it("should throw an error if category is invalid", () => {
        expect.assertions(2);
        const model = CategoryModel.build({
            category_id: "3f290c57-7b6b-4b7d-9d8e-285e404046a6",
        });

        try {
            CategoryModelMapper.toEntity(model);
            fail("should have thrown an error");
        } catch (error) {
            expect(error).toBeInstanceOf(EntityValidationError);
            expect((error as EntityValidationError).errors).toMatchObject([{

                name: ["name must be shorter than or equal to 255 characters"]

            }]);
        }
    });

    it("should convert a category model to entity", () => {
        const model = CategoryModel.build({
            category_id: "3f290c57-7b6b-4b7d-9d8e-285e404046a6",
            created_at: new Date(),
            description: "description",
            is_active: true,
            name: "name",
        });

        const entity = CategoryModelMapper.toEntity(model);

        expect(entity.toJSON()).toStrictEqual(
            new Category({
                category_id: new Uuid( "3f290c57-7b6b-4b7d-9d8e-285e404046a6"),
                created_at: model.created_at,
                description: model.description,
                is_active: model.is_active,
                name: model.name,
            }).toJSON()
            
        );
    });

    it("should convert a category entity to model", () => {
        const entity = new Category({
            category_id: new Uuid("3f290c57-7b6b-4b7d-9d8e-285e404046a6"),
            created_at: new Date(),
            description: "description",
            is_active: true,
            name: "name",
        });

        const model = CategoryModelMapper.toModel(entity);

        expect(model.toJSON()).toStrictEqual(CategoryModel.build({
            category_id: "3f290c57-7b6b-4b7d-9d8e-285e404046a6",
            created_at: entity.created_at,
            description: entity.description,
            is_active: entity.is_active,
            name: entity.name,
        }).toJSON());
        
    });
});