import { EntityValidationError } from "../../shared/domain/validators/validation.error";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { ValueObject } from "../../shared/domain/value-objects/value-object";
import { Entity } from "../../shared/entity";
import { CategoryValidatorFactory } from "./category.validator";

export type CategoryConstructorProps = {
    category_id?: Uuid;
    name: string;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date;
}

export type CategoryCreateCommand = {
    name: string;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date;
}


export class Category extends Entity {
    category_id?: Uuid;
    name: string;
    description: string | null;
    is_active?: boolean;
    created_at?: Date;

    constructor(props: CategoryConstructorProps) {
        super();

        this.category_id = props.category_id ?? new Uuid();
        this.name = props.name;
        this.description = props.description ?? null;
        this.is_active = props.is_active ?? true;
        this.created_at = props.created_at ?? new Date();
    }

    get entity_id(): ValueObject {
        return this.category_id;
    }

    static create(props: CategoryCreateCommand): Category {
        const category = new Category(props);

        Category.validate(category);

        return category;
    }

    static validate(entity: Category): void {
        const validator = CategoryValidatorFactory.create();

        const isValid = validator.validate(entity);

        if (!isValid) {
            throw new EntityValidationError(validator.errors);
        }

    }

    changeName(name: string): void {
        this.name = name;
        Category.validate(this);
    }

    changeDescription(description: string): void {
        this.description = description;
        Category.validate(this);
    }

    activate(): void {
        this.is_active = true;
    }

    deactivate(): void {
        this.is_active = false;
    }

    update(props: Omit<CategoryCreateCommand,"is_active">): void {
        this.name = props.name;
        this.description = props.description ?? null;
        Category.validate(this);
    }

    toJSON() {
        return {
            category_id: this.category_id?.id,
            name: this.name,
            description: this.description,
            is_active: this.is_active,
            created_ate: this.created_at
        };
    }
}