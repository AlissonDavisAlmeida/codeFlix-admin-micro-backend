import { SearchResult } from "../../domain/repository/repository.interface";
import { PaginationOutputMapper } from "./pagination-output.dto";

describe("PaginationOutputMapper", () => {
  it("should convert SearchResult  a PaginationOutput", () => {
    const searchResult = new SearchResult({
      items: [],
      total: 10,
      filter: null,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
    });

    const output = PaginationOutputMapper.toPaginationOutput(searchResult);

    expect(output).toStrictEqual({
      total: searchResult.total,
      current_page: searchResult.current_page,
      last_page: searchResult.last_page,
      per_page: searchResult.per_page,

    });
  });
});
