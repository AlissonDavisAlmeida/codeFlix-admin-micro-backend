
export class EntityValidationError extends Error {
    constructor(public errors: Array<string | { [key: string]: string[] }>, message = "Validation Error") {
        super(message);
    }

    countErrors(): number {
        return Object.keys(this.errors).length;
    }

    
}