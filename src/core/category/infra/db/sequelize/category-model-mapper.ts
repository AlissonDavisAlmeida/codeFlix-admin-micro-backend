import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/entities/category.entity";
import { CategoryAttributes, CategoryModel } from "./category.model";

export class CategoryModelMapper {
    static toModel(entity: Category): CategoryModel {
        return CategoryModel.build({
            category_id: entity.category_id.id,
            created_at: entity.created_at,
            description: entity.description,
            is_active: entity.is_active,
            name: entity.name,
        });
    }

    static toEntity(model: CategoryAttributes): Category {
        const category = new Category({
            category_id: new Uuid(model.category_id),
            created_at: model.created_at,
            description: model.description,
            is_active: model.is_active,
            name: model.name,
        });

        category.validate();

        if(category.notification.hasErrors()){
            throw new EntityValidationError(category.notification.toJSON());
        }

        return category;
    }
}