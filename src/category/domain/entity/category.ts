export class Category {

    #id: number;
    #name: string;
    #description: string;
    #createdAt: Date;
    #updatedAt: Date;


    constructor(id: number, name: string, description: string) {
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#createdAt = new Date();
        this.#updatedAt = new Date();
    }

    get name(): string {
        return this.#name;
    }
}