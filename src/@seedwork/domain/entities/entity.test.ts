import { validate } from "uuid";
import { UniqueEntityID } from "../value-objects/uniqueEntityID";
import { Entity } from "./Entity";

class StubEntity extends Entity<{ props1: string, props2: number }> {}

describe("Entity unit tests", () => {
  it("should set props and id", () => {
    const arrange = { props1: "props1", props2: 2 };

    const stub = new StubEntity(arrange);

    expect(stub.props).toStrictEqual(arrange);

    expect(stub.uniqueEntityId).toBeInstanceOf(UniqueEntityID);

    expect(validate(stub.id)).toBeTruthy();
  });

  it("should accept a valid uuid", () => {
    const arrange = { props1: "props1", props2: 2 };

    const stub = new StubEntity(arrange, new UniqueEntityID("d7c7a8d6-7c6b-4e1f-9b2e-5b7c9f9d1e2f"));

    expect(stub.props).toStrictEqual(arrange);

    expect(stub.uniqueEntityId).toBeInstanceOf(UniqueEntityID);

    expect(stub.id).toBe("d7c7a8d6-7c6b-4e1f-9b2e-5b7c9f9d1e2f");

    expect(validate(stub.id)).toBeTruthy();
  });

  it("should convert a entity to json", () => {
    const arrange = { props1: "props1", props2: 2 };

    const stub = new StubEntity(arrange);

    expect(stub.toJSON()).toStrictEqual({ id: stub.id, ...arrange });
  });
});
