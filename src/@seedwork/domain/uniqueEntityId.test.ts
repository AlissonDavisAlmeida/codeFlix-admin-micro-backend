import { InvalidUUIDError } from "../errors/invalidUUID.error";
import { UniqueEntityID } from "./uniqueEntityID";

describe("UniqueEntityId unit tests", () => {
  it("should throw error when uui is invalid", () => {
    const spyValidate = jest.spyOn(UniqueEntityID.prototype as any, "validate");

    expect(() => new UniqueEntityID("invalid-uuid")).toThrowError(new InvalidUUIDError("invalid-uuid"));
    expect(spyValidate).toHaveBeenCalled();
  });
});
