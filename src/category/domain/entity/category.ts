import { UniqueIdentity } from "../../../@seedwork/domain/valueObjects/unique_identity";

export interface CategoryState {

    readonly name: string;
    readonly description?: string;
    readonly isActive?: boolean;
    readonly createdAt?: Date;
}

export class Category {
    public readonly id: UniqueIdentity;
    #name: string;
    #description?: string;
    #createdAt: Date;
    #isActive?: boolean;

    constructor(
        { name, description, isActive, createdAt }: CategoryState,
        id?: UniqueIdentity
    ) {

        this.id = id ?? new UniqueIdentity();
        this.#name = name;
        this.Description = description;
        this.IsActive = isActive
        this.#createdAt = createdAt || new Date();
    }

    private set Description(description: string | undefined) {
        this.#description = description ?? null;
    }

    private set IsActive(isActive: boolean | undefined) {
        this.#isActive = isActive === undefined ? true : isActive;
    }

    get name(): string {
        return this.#name;
    }

    get description(): string {
        return this.#description;
    }

    get isActive(): boolean {
        return this.#isActive!;
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
        }
    }

}
