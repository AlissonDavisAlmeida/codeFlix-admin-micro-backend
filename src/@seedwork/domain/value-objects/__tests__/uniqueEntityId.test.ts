import { validate } from "uuid";
import { InvalidUUIDError } from "../../../errors/invalidUUID.error";
import { UniqueEntityID } from "../uniqueEntityID";

function spyValidateMethod() {
  return jest.spyOn(UniqueEntityID.prototype as any, "validate");
}

const spyValidate = spyValidateMethod();

describe("UniqueEntityId unit tests", () => {
  it("should throw error when uui is invalid", () => {
    expect(() => new UniqueEntityID("invalid-uuid")).toThrowError(new InvalidUUIDError("invalid-uuid"));
    expect(spyValidate).toHaveBeenCalled();
  });

  it("should accept a uuid passed in consturctor", () => {
    const uniqueUuid = new UniqueEntityID("74cc5a19-65c6-494f-ae6f-14a9b2e71005");

    expect(uniqueUuid.value).toBe("74cc5a19-65c6-494f-ae6f-14a9b2e71005");
    expect(spyValidate).toHaveBeenCalled();
    expect(spyValidate).toHaveBeenCalledTimes(1);
  });

  it("should generate a uuid when no uuid is passed in constructor", () => {
    const uniqueUuid = new UniqueEntityID();

    expect(uniqueUuid.value).toBeDefined();
    expect(validate(uniqueUuid.value)).toBeTruthy();
    expect(spyValidate).toHaveBeenCalled();
  });
});
