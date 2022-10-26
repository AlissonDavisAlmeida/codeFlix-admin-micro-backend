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

  // static validate(props: Omit<CategoryProps, "created_at">) {
  //   ValidatorRules.values(props.name, "name").required().string().maxLength(255);
  //   ValidatorRules.values(props.description, "description").string();
  //   ValidatorRules.values(props.is_active, "is_active").boolean();
  // }

  static validate(props: CategoryProps) {
    const validator = CategoryValidatorFactory.create();

    validator.validate(props);
  }

  activate(): void {
    this.#is_active = true;
  }

  deactivate(): void {
    this.#is_active = false;
  }
}
