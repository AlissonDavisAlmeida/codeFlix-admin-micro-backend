import { ValueObject } from "../value-object";


class StubValueObject<Value = string> extends ValueObject<Value> { }

describe('ValueObject unit tests', () => {


    it("should set value", () => {
        const valueObect = new StubValueObject("test");

        expect(valueObect.value).toBe("test");

        const valueObect2 = new StubValueObject<number>(1);

        expect(valueObect2.value).toBe(1);

        const valueObect3 = new StubValueObject<boolean>(true);

        expect(valueObect3.value).toBe(true);

        const valueObect4 = new StubValueObject<{}>({ props1: "value" });

        expect(valueObect4.value).toStrictEqual({ props1: "value" });
    })

})