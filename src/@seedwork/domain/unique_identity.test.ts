import { validate } from "uuid"
import { InvalidUuidError } from "../../@seedwork/errors/invalid_uuid.error"
import { UniqueIdentity } from "./unique_identity"

describe("Unique identity unit test", () => {

    it("should throw error when uuid is not valid", () => {
        const validateSpy = jest.spyOn(UniqueIdentity.prototype as any, "validate")
        expect(() => new UniqueIdentity("fake-uuid")).toThrowError(InvalidUuidError)
        expect(validateSpy).toHaveBeenCalled()
        expect(validateSpy).toHaveBeenCalledTimes(1)

    })

    it("should accept a uuid passed in constructor", ()=>{

        const validateSpy = jest.spyOn(UniqueIdentity.prototype as any, "validate")
        const id = "0fdb4026-4df1-4522-96d2-27c6ce868212"
        const identityVO = new UniqueIdentity("0fdb4026-4df1-4522-96d2-27c6ce868212")

        expect(identityVO.id).toBe(id)
        expect(validateSpy).toHaveBeenCalled()
        expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    it("should generate a uuid when no uuid is passed in constructor", ()=>{
            
            const validateSpy = jest.spyOn(UniqueIdentity.prototype as any, "validate")
            const identityVO = new UniqueIdentity()
    
            expect(validate(identityVO.id)).toBeTruthy()
            expect(validateSpy).toHaveBeenCalled()
            expect(validateSpy).toHaveBeenCalledTimes(1)
    })
})