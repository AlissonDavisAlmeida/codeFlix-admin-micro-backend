import { InvalidUuidError, Uuid } from "../uuid.vo"

const UUID_STUB = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
describe("Uuid unit tests",()=>{

    const validateSpy = jest.spyOn(Uuid.prototype as any,"validateUuid")

    test("should throw error when uuid is invalid",()=>{
        expect(()=>new Uuid("invalid-uuid")).toThrowError(new InvalidUuidError())
        expect(validateSpy).toHaveBeenCalled()
    })

    test("should create a valid uuid",()=>{
        const uuid = new Uuid()
        expect(uuid.id).toBeDefined()
        expect(validateSpy).toHaveBeenCalled()
    })
    test("should create a valid uuid from a string",()=>{
        const uuid = new Uuid(UUID_STUB)
        expect(uuid.id).toBe(UUID_STUB)
        expect(validateSpy).toHaveBeenCalled()
    })

})
