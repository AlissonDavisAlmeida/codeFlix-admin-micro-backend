import { v4 as uuidV4, validate } from "uuid";
import { InvalidUUIDError } from "../errors/invalidUUID.error";

export class UniqueEntityID {
  #id?: string;

  constructor(id?: string) {
    this.#id = id ?? uuidV4();
    this.validate();
  }

  private validate() {
    const isValid = validate(this.#id);

    if (!isValid) {
      throw new InvalidUUIDError(this.#id);
    }
  }
}
