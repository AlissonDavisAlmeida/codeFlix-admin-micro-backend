import { Category } from "./category";


describe("Category unit test",()=>{

    it("should be created",()=>{
        const category = new Category(1,"test","test");
        
        
        expect(category).toBeTruthy();
        expect(category.name).toBe("test");

    });

})