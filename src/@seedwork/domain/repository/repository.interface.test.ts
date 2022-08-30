import { SearchParams } from "./repository.interface";

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
  test.only("per_page prop", () => {
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
});
