import { validate } from "uuid"
import { InvalidUuidError } from "../../../errors/invalid_uuid.error"
import { UniqueIdentity } from "../unique_identity"

describe("Unique identity unit test", () => {

    const spyValidateMethod = jest.spyOn(UniqueIdentity.prototype as any, "validate")


    it("should throw error when uuid is not valid", () => {
        expect(() => new UniqueIdentity("fake-uuid")).toThrowError(InvalidUuidError)
        expect(spyValidateMethod).toHaveBeenCalled()
        expect(spyValidateMethod).toHaveBeenCalledTimes(1)

    })

    it("should accept a uuid passed in constructor", ()=>{

        const id = "0fdb4026-4df1-4522-96d2-27c6ce868212"
        const identityVO = new UniqueIdentity("0fdb4026-4df1-4522-96d2-27c6ce868212")

        expect(identityVO.value).toBe(id)
        expect(spyValidateMethod).toHaveBeenCalled()
        expect(spyValidateMethod).toHaveBeenCalledTimes(1)
    })

    it("should generate a uuid when no uuid is passed in constructor", ()=>{
            
            const identityVO = new UniqueIdentity()
    
            expect(validate(identityVO.value)).toBeTruthy()
            expect(spyValidateMethod).toHaveBeenCalled()
            expect(spyValidateMethod).toHaveBeenCalledTimes(1)
    })

    
    
})