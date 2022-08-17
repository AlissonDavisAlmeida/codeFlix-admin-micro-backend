import { deepFreeze } from "./object"

describe("object unit tests", () => {

    it("should a immutable object", () => {
        let obj = deepFreeze({ prop: "value1", deepFreeze: { props2: "value2", props3: new Date() } })


        expect(() => {
            obj.prop = "value2"
        }).toThrow()

        expect(() => {
            obj.deepFreeze.props2 = "value3"
        }).toThrow()

        expect(typeof obj.deepFreeze.props3).toBe("object")
    })

    it("should not freeze a scalar value", () => {
        const str = deepFreeze("a")
        expect(typeof str).toBe("string")

        const bool = deepFreeze(true)
        expect(typeof bool).toBe("boolean")

        const num = deepFreeze(1)
        expect(typeof num).toBe("number")
    })
})