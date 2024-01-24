import { FieldsErrors } from "./validators-fields.interface";

export class EntityValidationError extends Error {
    constructor(public errors: FieldsErrors, message = "Validation Error") {
        super(message);
    }

    countErrors(): number {
        return Object.keys(this.errors).length;
    }

    
}