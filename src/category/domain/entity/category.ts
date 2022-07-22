import { BaseEntity } from "../../../@seedwork/domain/entity/BaseEntity";
import { UniqueIdentity } from "../../../@seedwork/domain/valueObjects/unique_identity";

export interface CategoryState {

  readonly name: string;
  readonly description?: string;
  readonly isActive?: boolean;
  readonly createdAt?: Date;
}

export class Category extends BaseEntity<CategoryState> {
  #name: string;

  #description?: string;

  #createdAt: Date;

  #isActive?: boolean;

  constructor(
    {
      name, description, isActive, createdAt,
    }: CategoryState,
    id?: UniqueIdentity,
  ) {
    super({
      name, description, isActive, createdAt,
    }, id);
    this.#name = name;
    this.description = description;
    this.IsActive = isActive;
    this.#createdAt = createdAt || new Date();
  }

  private set IsActive(isActive: boolean | undefined) {
    this.#isActive = isActive === undefined ? true : isActive;
  }

  get name(): string {
    return this.#name;
  }

  set description(description: string | undefined) {
    this.#description = description ?? null;
  }

  get description(): string {
    return this.#description;
  }

  get isActive(): boolean {
    return this.#isActive;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  getProps(): CategoryState {
    return {
      name: this.#name,
      description: this.#description,
      isActive: this.#isActive,
      createdAt: this.#createdAt,
    };
  }
}
