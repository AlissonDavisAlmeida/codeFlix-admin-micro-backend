import { Notification } from "../../../shared/domain/validators/notification";
import { EntityValidationError } from "../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { ValueObject } from "../../../shared/domain/value-objects/value-object";
import { Entity } from "../../../shared/entity";
import { CategoryFakeBuilder } from "./category-faker.builder";
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
    notification: Notification = new Notification();

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

        category.validate(["name"]);

        return category;
    }

validate(fields?: string[]): void {
        const validator = CategoryValidatorFactory.create();
        validator.validate(this.notification, this, fields);

        // if (!isValid) {
        //     throw new EntityValidationError(this.notification.toJSON());
        // }

    }

    static fake() {
        return CategoryFakeBuilder;
    }

    changeName(name: string): void {
        this.name = name;
        this.validate(["name"]);
    }

    changeDescription(description: string): void {
        this.description = description;
        // this.validate(["description"]);
    }

    activate(): void {
        this.is_active = true;
    }

    deactivate(): void {
        this.is_active = false;
    }

    update(props: Omit<CategoryCreateCommand, "is_active">): void {
        this.name = props.name;
        this.description = props.description ?? null;
        this.validate(["name"]);
    }

    toJSON() {
        return {
            category_id: this.category_id?.id,
            name: this.name,
            description: this.description,
            is_active: this.is_active,
            created_at: this.created_at
        };
    }
}