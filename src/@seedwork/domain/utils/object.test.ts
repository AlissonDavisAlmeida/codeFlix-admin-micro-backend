import { deepFreeze } from "./object";

describe("Object unit tests", () => {
  it("should not freeze a scalar value", () => {
    const str = deepFreeze("a");
    expect(typeof str).toBe("string");

    const bool = deepFreeze(true);
    expect(typeof bool).toBe("boolean");

    const num = deepFreeze(1);
    expect(typeof num).toBe("number");
  });
  it("should be a immutable object", () => {
    const obj = deepFreeze({ prop1: "a", nested: { prop2: "b" } });

    expect(() => {
      (obj as any).prop1 = "c";
    }).toThrowError("Cannot assign to read only property 'prop1' of object '#<Object>'");

    expect(() => {
      (obj as any).nested.prop2 = "c";
    }).toThrowError("Cannot assign to read only property 'prop2' of object '#<Object>'");
  });
});
