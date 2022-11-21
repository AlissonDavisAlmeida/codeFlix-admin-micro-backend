import { SearchParams, SearchResult } from "../repository-contract";

describe("Search unit tests", () => {
  describe("SearchParams unit tests", () => {
    test("page prop", () => {
      const params = new SearchParams({

      });

      expect(params.page).toBe(1);

      const arrange: { page: any, expected: number }[] = [
        { page: null, expected: 1 },
        { page: undefined, expected: 1 },
        { page: 0, expected: 1 },
        { page: "", expected: 1 },
        { page: "0", expected: 1 },
        { page: -1, expected: 1 },
        { page: 3.3, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: [], expected: 1 },
      ];

      arrange.forEach((item) => {
        expect(new SearchParams({ page: item.page }).page).toBe(item.expected);
      });
    });

    test("per_page prop", () => {
      const params = new SearchParams({

      });

      expect(params.per_page).toBe(15);

      const arrange: { per_page: any, expected: number }[] = [
        { per_page: null, expected: 15 },
        { per_page: undefined, expected: 15 },
        { per_page: 0, expected: 15 },
        { per_page: "", expected: 15 },
        { per_page: "0", expected: 15 },
        { per_page: -15, expected: 15 },
        { per_page: 3.3, expected: 15 },
        { per_page: true, expected: 15 },
        { per_page: false, expected: 15 },
        { per_page: {}, expected: 15 },
        { per_page: [], expected: 15 },

        { per_page: 10, expected: 10 },
        { per_page: "10", expected: 10 },

      ];

      arrange.forEach((item) => {
        expect(new SearchParams({ per_page: item.per_page }).per_page).toBe(item.expected);
      });
    });

    test("sort prop", () => {
      const params = new SearchParams({

      });

      expect(params.sort).toBeNull();

      const arrange: { sort: any, expected: string }[] = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: 0, expected: "0" },
        { sort: "", expected: null },
        { sort: "0", expected: "0" },
        { sort: -15, expected: "-15" },
        { sort: 3.3, expected: "3.3" },
        { sort: true, expected: "true" },
        { sort: false, expected: "false" },
        { sort: {}, expected: "[object Object]" },
        { sort: [], expected: "" },

        { sort: 10, expected: "10" },
        { sort: "10", expected: "10" },

      ];

      arrange.forEach((item) => {
        expect(new SearchParams({ sort: item.sort }).sort).toBe(item.expected);
      });
    });

    test("sort_dir prop", () => {
      let params = new SearchParams({

      });

      expect(params.sort_dir).toBeNull();

      params = new SearchParams({
        sort: null,
      });

      expect(params.sort_dir).toBeNull();

      const arrange: { sort_dir: any, expected: string }[] = [
        { sort_dir: null, expected: "asc" },
        { sort_dir: undefined, expected: "asc" },
        { sort_dir: 0, expected: "asc" },
        { sort_dir: "", expected: "asc" },
        { sort_dir: "0", expected: "asc" },
        { sort_dir: "desc", expected: "desc" },
        { sort_dir: "DESC", expected: "desc" },
        { sort_dir: "asc", expected: "asc" },
        { sort_dir: "ASC", expected: "asc" },
      ];

      arrange.forEach((item) => {
        expect(new SearchParams({ sort: "field", sort_dir: item.sort_dir }).sort_dir).toBe(item.expected);
      });
    });

    test("filter prop", () => {
      let params = new SearchParams({

      });

      expect(params.filter).toBeNull();

      const arrange: { filter: any, expected: string }[] = [
        { filter: null, expected: null },
        { filter: undefined, expected: null },
        { filter: 0, expected: "0" },
        { filter: "", expected: null },
        { filter: "0", expected: "0" },
        { filter: "desc", expected: "desc" },
        { filter: "DESC", expected: "DESC" },
        { filter: "asc", expected: "asc" },
        { filter: "ASC", expected: "ASC" },
        { filter: true, expected: "true" },
        { filter: false, expected: "false" },
        { filter: {}, expected: "[object Object]" },
      ];

      arrange.forEach((item) => {
        expect(new SearchParams({ filter: item.filter }).filter).toBe(item.expected);
      });
    });
  });

  describe("SearchResult unit tests", () => {
    test("constructor props", () => {
      let result = new SearchResult({
        items: ["item1", "item2"] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      expect(result.items).toEqual(["item1", "item2"]);
      expect(result.toJSON()).toStrictEqual({
        items: ["item1", "item2"] as any,
        total: 4,
        current_page: 1,
        last_page: 2,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      result = new SearchResult({
        items: ["item1", "item2"] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: "test",
      });

      expect(result.items).toEqual(["item1", "item2"]);
      expect(result.toJSON()).toStrictEqual({
        items: ["item1", "item2"] as any,
        total: 4,
        current_page: 1,
        last_page: 2,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: "test",
      });
    });

    it("should set last_page 1 when per_page field is greater than total field", () => {
      const result = new SearchResult({
        items: ["item1", "item2"] as any,
        total: 4,
        current_page: 1,
        per_page: 10,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      expect(result.last_page).toBe(1);
    });
  });
});
