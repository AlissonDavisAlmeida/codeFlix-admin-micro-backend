import { SearchParams, SearchResult } from "../repository.interface";

describe("Search Params Unit Tests", () => {
  test("page prop", () => {
    const params = new SearchParams();

    expect(params.page).toBe(1);

    const arrange: any[] = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: 0, expected: 1 },
      { page: "0", expected: 1 },
      { page: -1, expected: 1 },
      { page: 1, expected: 1 },
      { page: 4.5, expected: 1 },
      { page: "4.5", expected: 1 },
      { page: "4", expected: 4 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: "true", expected: 1 },
      { page: "false", expected: 1 },
    ];

    arrange.forEach((item) => {
      expect(new SearchParams({ page: item.page }).page).toBe(item.expected);
    });
  });
  test("per_page prop", () => {
    const params = new SearchParams();

    expect(params.per_page).toBe(params.per_page);

    const arrange: any[] = [
      { per_page: null, expected: params.per_page },
      { per_page: undefined, expected: params.per_page },
      { per_page: 0, expected: params.per_page },
      { per_page: "0", expected: params.per_page },
      { per_page: -1, expected: params.per_page },
      { per_page: 1, expected: 1 },
      { per_page: 4.5, expected: params.per_page },
      { per_page: "4.5", expected: params.per_page },
      { per_page: "4", expected: 4 },
      { per_page: true, expected: params.per_page },
      { per_page: false, expected: params.per_page },
      { per_page: "true", expected: params.per_page },
      { per_page: "false", expected: params.per_page },
      { per_page: 10, expected: 10 },
    ];

    arrange.forEach((item) => {
      expect(new SearchParams({ per_page: item.per_page }).per_page).toBe(item.expected);
    });
  });
  test("sort prop", () => {
    const params = new SearchParams();

    expect(params.sort).toBeNull();

    const arrange: any[] = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: "", expected: null },
      { sort: "fake", expected: "fake" },
      { sort: 0, expected: "0" },
      { sort: -1, expected: "-1" },
      { sort: true, expected: "true" },
      { sort: false, expected: "false" },
      { sort: {}, expected: "[object Object]" },
    ];

    arrange.forEach((item) => {
      expect(new SearchParams({ sort: item.sort }).sort).toBe(item.expected);
    });
  });
  test("sort_dir prop", () => {
    let params = new SearchParams();
    expect(params.sort_dir).toBeNull();

    params = new SearchParams({ sort: null });
    expect(params.sort_dir).toBeNull();
    params = new SearchParams({ sort: undefined });
    expect(params.sort_dir).toBeNull();
    params = new SearchParams({ sort: "" });
    expect(params.sort_dir).toBeNull();

    const arrange: any[] = [
      { sort_dir: null, expected: "asc" },
      { sort_dir: undefined, expected: "asc" },
      { sort_dir: "", expected: "asc" },
      { sort_dir: "fake", expected: "asc" },
      { sort_dir: 0, expected: "asc" },

      { sort_dir: "asc", expected: "asc" },
      { sort_dir: "desc", expected: "desc" },
      { sort_dir: "ASC", expected: "asc" },
      { sort_dir: "DESC", expected: "desc" },
    ];

    arrange.forEach((item) => {
      expect(new SearchParams({ sort: "field", sort_dir: item.sort_dir }).sort_dir).toBe(item.expected);
    });
  });

  test("filter prop", () => {
    const params = new SearchParams();

    expect(params.filter).toBeNull();

    const arrange: any[] = [
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: 0, expected: null },
      { filter: 10, expected: "10" },
    ];

    arrange.forEach((item) => {
      expect(new SearchParams({ filter: item.filter }).filter).toBe(item.expected);
    });
  });
});

describe("SearchResult unit tests", () => {
  test("constructor", () => {
    const search = new SearchResult({
      items: ["item1", "item2"] as any,
      total: 5,
      current_page: 1,
      per_page: 2,
      filter: null,
      sort: null,
      sort_dir: null,
    });

    expect(search.toJSON()).toStrictEqual({
      items: ["item1", "item2"],
      total: 5,
      current_page: 1,
      per_page: 2,
      filter: null,
      sort: null,
      sort_dir: null,
      last_page: 3,
    });
  });

  it("should set last_page to 1 when per_page is greater than total", () => {
    const search = new SearchResult({
      items: ["item1", "item2"] as any,
      total: 4,
      current_page: 1,
      per_page: 10,
      filter: null,
      sort: null,
      sort_dir: null,
    });

    expect(search.toJSON()).toStrictEqual({
      items: ["item1", "item2"],
      total: 4,
      current_page: 1,
      per_page: 10,
      filter: null,
      sort: null,
      sort_dir: null,
      last_page: 1,
    });
  });
});
