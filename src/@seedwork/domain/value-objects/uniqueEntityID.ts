import { v4 as uuidV4, validate } from "uuid";
import { InvalidUUIDError } from "../errors/invalidUUID.error";
import { ValueObject } from "./value-object";

export class UniqueEntityID extends ValueObject<string> {
  constructor(id?: string) {
    super(id ?? uuidV4());
    this.validate();
  }

  private validate() {
    const isValid = validate(this._value);

    if (!isValid) {
      throw new InvalidUUIDError(this._value);
    }
  }
}
