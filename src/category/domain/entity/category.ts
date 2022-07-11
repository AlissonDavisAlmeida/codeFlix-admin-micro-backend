interface CategoryState {
    readonly name: string;
    readonly description?: string;
    readonly isActive?: boolean;
}

export class Category {

    #id: number;
    #name: string;
    #description?: string;
    #createdAt: Date;
    #isActive?: boolean;

    constructor(
        { name, description, isActive }: CategoryState,
    ) {

        this.#id = 0;
        this.#name = name;
        this.description = description;
        this.isActive = isActive
        this.#createdAt = new Date();
    }

    private set description(description: string | undefined) {
        this.#description = description ?? "";
    }

    private set isActive(isActive: boolean | undefined) {
        this.#isActive = isActive || true;
    }

    get name(): string {
        return this.#name;
    }

    get description(): string {
        return this.#description ?? "";
    }

    get isActive(): boolean {
        return this.#isActive!;
    }

    get id(): number {
        return this.#id;
    }

    get createdAt(): Date {
        return this.#createdAt;
    }

    getProps(): CategoryState {
        return {
            name: this.#name,
            description: this.#description,
            isActive: this.#isActive,
        }
    }

}
