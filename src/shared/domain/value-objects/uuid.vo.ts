import { ValueObject } from "../value-object";
import { v4 as uuidV4, validate as uuidValidate } from "uuid"

export class Uuid extends ValueObject {
    readonly id: string

    constructor(id?: string) {
        super()
        this.id = id || this.generateUuid()
        this.validateUuid()
    }

    private generateUuid(): string {
        return uuidV4()
    }

    private validateUuid(): boolean {
        const isValid = uuidValidate(this.id)

        if(!isValid) {
            throw new InvalidUuidError()
        }

        return isValid
    }
}

export class InvalidUuidError extends Error {
    constructor(message?: string) {
        super(message || "Invalid Uuid")
        this.name = "InvalidUuidError"
    }
}