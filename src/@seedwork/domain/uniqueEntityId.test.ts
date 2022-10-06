import { validate } from "uuid";
import { InvalidUUIDError } from "../errors/invalidUUID.error";
import { UniqueEntityID } from "./uniqueEntityID";

describe("UniqueEntityId unit tests", () => {
  it("should throw error when uui is invalid", () => {
    const spyValidate = jest.spyOn(UniqueEntityID.prototype as any, "validate");

    expect(() => new UniqueEntityID("invalid-uuid")).toThrowError(new InvalidUUIDError("invalid-uuid"));
    expect(spyValidate).toHaveBeenCalled();
  });

  it("should accept a uuid passed in consturctor", () => {
    const spyValidate = jest.spyOn(UniqueEntityID.prototype as any, "validate");
    const uniqueUuid = new UniqueEntityID("74cc5a19-65c6-494f-ae6f-14a9b2e71005");

    expect(uniqueUuid.id).toBe("74cc5a19-65c6-494f-ae6f-14a9b2e71005");
    expect(spyValidate).toHaveBeenCalled();
  });

  it("should generate a uuid when no uuid is passed in constructor", () => {
    const validateSpy = jest.spyOn(UniqueEntityID.prototype as any, "validate");

    const uniqueUuid = new UniqueEntityID();

    expect(uniqueUuid.id).toBeDefined();
    expect(validate(uniqueUuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });
});
