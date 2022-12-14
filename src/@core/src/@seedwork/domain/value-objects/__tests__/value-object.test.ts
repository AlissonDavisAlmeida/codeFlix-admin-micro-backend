import { ValueObject } from "../value-object";

class StubValueObject<Value> extends ValueObject<Value> { }

describe("ValueObject unit tests", () => {
  it("should set value", () => {
    const valueObect = new StubValueObject("test");

    expect(valueObect.value).toBe("test");

    const valueObect2 = new StubValueObject<number>(1);

    expect(valueObect2.value).toBe(1);

    const valueObect3 = new StubValueObject<boolean>(true);

    expect(valueObect3.value).toBe(true);

    const valueObect4 = new StubValueObject<any>({ props1: "value" });

    expect(valueObect4.value).toStrictEqual({ props1: "value" });
  });

  it("should convert to a string", () => {
    const valueObect = new StubValueObject("test");
    expect(`${valueObect}`).toBe("test");

    const valueObect2 = new StubValueObject<number>(1);

    expect(`${valueObect2}`).toBe("1");

    const valueObect3 = new StubValueObject<boolean>(true);

    expect(`${valueObect3}`).toBe("true");
  });

  it("should be immutable", () => {
    const valueObect = new StubValueObject({ props1: "value", deep: { props2: "value" } });

    expect(() => {
      (valueObect as any).value.props1 = "c";
    }).toThrowError("Cannot assign to read only property 'props1' of object '#<Object>'");

    expect(() => {
      (valueObect as any).value.deep.props2 = "c";
    }).toThrowError("Cannot assign to read only property 'props2' of object '#<Object>'");
  });
});
