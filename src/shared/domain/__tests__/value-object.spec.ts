import { ValueObject } from "../value-objects/value-object";

class StringValueObject extends ValueObject {
    constructor(readonly value: string) {
        super()
    }

}

class ComplexValueObject extends ValueObject {
    constructor(readonly value: string, readonly value2: number) {
        super()
    }
}

describe("Value Object unit tests", () => {

    test("should be equals", ()=>{
        const valueObject1 = new StringValueObject("test")
        const valueObject2 = new StringValueObject("test")

        expect(valueObject1.equals(valueObject2)).toBe(true)

        const valueObject3 = new ComplexValueObject("test", 1)
        const valueObject4 = new ComplexValueObject("test", 1)

        expect(valueObject3.equals(valueObject4)).toBe(true)
    })

        
    test("should not be equals", ()=>{
        const valueObject1 = new StringValueObject("test")
        const valueObject2 = new StringValueObject("test2")

        expect(valueObject1.equals(valueObject2)).toBe(false)
        expect(valueObject1.equals(null as any)).toBe(false)
        expect(valueObject1.equals(undefined as any)).toBe(false)

        const valueObject3 = new ComplexValueObject("test", 1)
        const valueObject4 = new ComplexValueObject("test", 2)

        expect(valueObject3.equals(valueObject4)).toBe(false)
        expect(valueObject3.equals(null as any)).toBe(false)
        expect(valueObject3.equals(undefined as any)).toBe(false)
    })
})