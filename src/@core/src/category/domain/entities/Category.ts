import { EntityValidationError } from "../../../@seedwork/domain/errors/Validation-error";
import { Entity } from "../../../@seedwork/domain/entities/Entity";
import { UniqueEntityID } from "../../../@seedwork/domain/value-objects/uniqueEntityID";
import { CategoryValidatorFactory } from "../validators/category-validator";

export type CategoryProps = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};

export class Category extends Entity<CategoryProps> {
  #name: string;

  #description?: string;

  #created_at: Date;

  #is_active: boolean;

  constructor(props: CategoryProps, id?: UniqueEntityID) {
    Category.validate(props);
    super(props, id);
    this.name = props.name;
    this.description = props.description ?? null;
    this.#created_at = props.created_at ?? new Date();
    this.#is_active = props.is_active ?? true;

    this.props = {
      ...this.props,
      name: this.name,
      description: this.description,
      created_at: this.created_at,
      is_active: this.is_active,
    };
  }

  private set name(name: string) {
    this.#name = name;
  }

  get name(): string {
    return this.#name;
  }

  private set description(description: string) {
    this.#description = description;
  }

  get description(): string {
    return this.#description ?? null;
  }

  get created_at(): Date {
    return this.#created_at;
  }

  private set is_active(is_active: boolean) {
    this.#is_active = is_active;
  }

  get is_active(): boolean {
    return this.#is_active;
  }

  update(name: string, description: string): void {
    Category.validate({
      name,
      description,
    });
    this.name = name;
    this.description = description;
  }

  static validate(props: CategoryProps) {
    const validator = CategoryValidatorFactory.create();

    const isValid = validator.validate(props);

    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  activate(): void {
    this.#is_active = true;
  }

  deactivate(): void {
    this.#is_active = false;
  }
}
