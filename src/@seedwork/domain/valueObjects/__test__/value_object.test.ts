import { ValueObject } from "../valueObject";


class StubValueObject extends ValueObject<any>{

}

describe("ValueObject unit tests", () => {

    it("should be instantiable", () => {
        let valueObject = new StubValueObject("string");
        expect(valueObject).toBeInstanceOf(ValueObject);
        expect(valueObject.value).toBe("string");

        valueObject = new StubValueObject(1);
        expect(valueObject).toBeInstanceOf(ValueObject);
        expect(valueObject.value).toBe(1);

        valueObject = new StubValueObject(true);
        expect(valueObject).toBeInstanceOf(ValueObject);
        expect(valueObject.value).toBe(true);

        valueObject = new StubValueObject({ nome: "teste" });
        expect(valueObject).toBeInstanceOf(ValueObject);
        expect(valueObject.value).toStrictEqual({ nome: "teste" });
    })

    it("should convert to a string", () => {

        let arrange = [
            { value: "string", expected: "\"string\"" },
            { value: 1, expected: "1" },
            { value: true, expected: "true" },
            { value: { nome: "teste" }, expected: "{\"nome\":\"teste\"}" },
            { value: null, expected: "null" },
            { value: undefined, expected: "undefined" }
        ]

        arrange.forEach(item => {
            const valueObject = new StubValueObject(item.value);
            expect(item.value === undefined ? valueObject + "" : valueObject.toString()).toBe(item.expected);
        })


    })
})