import { InvalidUuidError } from "../../errors/invalid_uuid.error";
import { v4 as uuid, validate } from "uuid"
import { ValueObject } from "./valueObject";

export class UniqueIdentity extends ValueObject<string>{
    constructor(private readonly id?: string) {
        super(id || uuid());
        this.validate();
    }

    private validate() {
        const isValidIdentity = validate(this.value);
        if (!isValidIdentity) {
            throw new InvalidUuidError(`Invalid UUID: ${this.value}`);
        }


    }
}