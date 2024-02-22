import { SearchParamsResult } from "../search-result";

describe("SearchResult unit tests", ()=>{
    test("constructor props", ()=>{
        const result = new SearchParamsResult({
            items: ["item1", "item2"] as any,
            total: 4,
            current_page: 1,
            per_page: 2
        });

        expect(result.toJSON()).toStrictEqual({
            items: ["item1", "item2"],
            total: 4,
            current_page: 1,
            per_page: 2,
            last_page: 2,
        });


    });

    test("should set last_page = 1 when per_page field is greater than total field", ()=>{
        const result = new SearchParamsResult({
            items: ["item1", "item2"] as any,
            total: 4,
            current_page: 1,
            per_page: 5
        });

        expect(result.last_page).toBe(1);
    });

    test("should ceil last_page when total isn't divisible by per_page", ()=>{
        const result = new SearchParamsResult({
            items: ["item1", "item2"] as any,
            total: 4,
            current_page: 1,
            per_page: 3
        });

        expect(result.last_page).toBe(2);
    });
});