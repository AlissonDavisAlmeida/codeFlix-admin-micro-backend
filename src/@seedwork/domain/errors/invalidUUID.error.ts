export class InvalidUUIDError extends Error {
  constructor(uuid: string) {
    super(`Invalid UUID: ${uuid}`);
    this.name = "InvalidUUIDError";
  }
}
