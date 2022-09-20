import { CategoryOutputMapper } from "../../dto/category.output";
import { CategoryRepository } from "../../../domain/repository/category-repository";
import { Category } from "../../../domain/entity/category";
import { CategoryInMemoryRepository } from "../../../infra/repository/category-repositoryInMemory";
import { ListCategories } from "../listCategories";

describe("ListCategory tests", () => {
  let useCase: ListCategories;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new ListCategories(repository);
  });

  it("toOutput method", async () => {
    let result = new CategoryRepository.SearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    let output = useCase["toOutput"](result);

    expect(output).toStrictEqual({
      items: [],
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page,
    });

    const category = new Category({ name: "test" });
    result = new CategoryRepository.SearchResult({
      items: [category],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    output = useCase["toOutput"](result);

    expect(output).toStrictEqual({
      items: [
        CategoryOutputMapper.toOutput(category),
      ],
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page,
    });
  });

  it("should returns output using empty input with categories ordered by created_at", async () => {
    const items = [
      new Category({ name: "test1", createdAt: new Date() }),
      new Category({ name: "test2", createdAt: new Date(new Date().getTime() + 1000) }),
    ];

    repository.items = items;

    const output = await useCase.execute({});

    expect(output).toStrictEqual({
      items: [...items].reverse().map((category) => CategoryOutputMapper.toOutput(category)),
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should returns output using pagination, sort and filter ", async () => {
    const items = [
      new Category({ name: "a" }),
      new Category({ name: "AAA" }),
      new Category({ name: "aa" }),
      new Category({ name: "b" }),
      new Category({ name: "c" }),
    ];

    repository.items = items;

    let output = await useCase.execute({
      page: 1,
      per_page: 3,
      sort: "name",
      filter: "a",
    });

    expect(output).toStrictEqual({
      items: [CategoryOutputMapper.toOutput(items[1]),
        CategoryOutputMapper.toOutput(items[0]),
        CategoryOutputMapper.toOutput(items[2])],
      total: 3,
      current_page: 1,
      last_page: 1,
      per_page: 3,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });

    expect(output).toStrictEqual({
      items: [
        CategoryOutputMapper.toOutput(items[2])],
      total: 3,
      current_page: 2,
      last_page: 2,
      per_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
      sort_dir: "desc",
    });

    expect(output).toStrictEqual({
      items: [
        CategoryOutputMapper.toOutput(items[1])],
      total: 3,
      current_page: 2,
      last_page: 2,
      per_page: 2,
    });
  });
});
