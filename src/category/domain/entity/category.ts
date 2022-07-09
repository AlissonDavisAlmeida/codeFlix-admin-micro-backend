interface CategoryState {
    readonly name: string;
    readonly description?: string;
    readonly isActive?: boolean;
}

export class Category {

    #id: number;
    #name: string;
    #description: string;
    #createdAt: Date;
    #updatedAt: Date;


    constructor(
        { name, description, isActive }: CategoryState,
    ) {

        this.#id = 0;
        this.#name = name;
        this.#description = description || "";
        this.#createdAt = new Date();
        this.#updatedAt = new Date();
    }

    get name(): string {
        return this.#name;
    }

    get description(): string {
        return this.#description;
    }

    get isActive(): boolean {
        return true;
    }
    
    get id(): number {
        return this.#id;
    }

    get createdAt(): Date {
        return this.#createdAt;
    }

}
