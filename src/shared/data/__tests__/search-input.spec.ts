import { SearchParamsInput } from "../search-input";

describe("SearchParamsInput unit tests", () => {
    test("page prop", () => {
        const params = new SearchParamsInput();
        expect(params.page).toBe(1);

        const arrange: any[] = [
            { page: null, expected: 1 },
            { page: undefined, expected: 1 },
            { page: "", expected: 1 },
            { page: "fake", expected: 1 },
            { page: 0, expected: 1 },
            { page: -1, expected: 1 },
            { page: 5.5, expected: 1 },
            { page: true, expected: 1 },
            { page: false, expected: 1 },
            { page: {}, expected: 1 },

            { page: 1, expected: 1 },
            { page: 2, expected: 2 },
        ];

        arrange.forEach((arr) => {
            expect(new SearchParamsInput({ page: arr.page }).page).toBe(arr.expected);
        });
    });

    test("perPage prop", () => {
        const params = new SearchParamsInput();
        expect(params.perPage).toBe(15);

        const arrange: any[] = [
            { per_page: null, expected: 15 },
            { per_page: undefined, expected: 15 },
            { per_page: "", expected: 15 },
            { per_page: "fake", expected: 15 },
            { per_page: 0, expected: 15 },
            { per_page: -1, expected: 15 },
            { per_page: 5.5, expected: 15 },
            { per_page: true, expected: 15 },
            { per_page: false, expected: 15 },
            { per_page: {}, expected: 15 },

            { per_page: 1, expected: 1 },
            { per_page: 2, expected: 2 },
            {per_page: 10, expected: 10},
        ];

        arrange.forEach((arr) => {
            expect(new SearchParamsInput({ per_page: arr.per_page }).perPage).toBe(arr.expected);
        });
    });

    test("sortBy prop", () => {
        const params = new SearchParamsInput();
        expect(params.sortBy).toBe(null);

        const arrange: any[] = [
            { sort_by: null, expected: null },
            { sort_by: undefined, expected: null },
            { sort_by: "", expected: null },
            { sort_by: 0, expected: "0" },
            { sort_by: -1, expected: "-1" },
            { sort_by: 5.5, expected: "5.5" },
            { sort_by: {}, expected: "[object Object]" },
            { sort_by: "name", expected: "name" },
        ];

        arrange.forEach((arr) => {
            expect(new SearchParamsInput({ sort_by: arr.sort_by }).sortBy).toBe(arr.expected);
        });
    });

    test("sortDirection prop", () => {
        let params = new SearchParamsInput();
        expect(params.sortDirection).toBe(null);

        params = new SearchParamsInput({ sort_by: null });
        expect(params.sortDirection).toBe(null);

        params = new SearchParamsInput({ sort_by: undefined });
        expect(params.sortDirection).toBe(null);

        params = new SearchParamsInput({ sort_by: "" });
        expect(params.sortDirection).toBe(null);

        const arrange: any[] = [
            { sort_direction: null, expected: "asc" },
            { sort_direction: undefined, expected: "asc" },
            { sort_direction: "", expected: "asc" },
            { sort_direction: 0, expected: "asc" },
            { sort_direction: "fake", expected: "asc" },

            {sort_direction: "asc", expected: "asc"},
            {sort_direction: "desc", expected: "desc"},
            {sort_direction: "ASC", expected: "asc"},
            {sort_direction: "DESC", expected: "desc"},
        ];

        arrange.forEach((arr) => {
            expect(new SearchParamsInput({ 
                sort_by: "field",
                sort_direction: arr.sort_direction 
            })
            .sortDirection)
            .toBe(arr.expected);
        });
    });

    test("filter prop", () => {
        const params = new SearchParamsInput();
        expect(params.filter).toBe(null);

        const arrange: any[] = [
            { filter: null, expected: null },
            { filter: undefined, expected: null },
            { filter: "", expected: null },
            
            { filter: 0, expected: "0" },
            { filter: -1, expected: "-1" },
            { filter: 5.5, expected: "5.5" },
            { filter: {}, expected: "[object Object]" },
            { filter: "name", expected: "name" },
        ];

        arrange.forEach((arr) => {
            expect(new SearchParamsInput({ filter: arr.filter }).filter).toBe(arr.expected);
        });
    });
});