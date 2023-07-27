import _chance from "chance";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { ListCategories } from "../../listCategories";

const chance = _chance();

describe("List Categories integration tests use case", () => {
  let useCase: ListCategories;
  let repository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({
    models: [CategorySequelize.CategoryModel],
  });

  beforeEach(() => {
    repository = new CategorySequelize.CategorySequelizeRepository(CategorySequelize.CategoryModel);
    useCase = new ListCategories(repository);
  });
  it("should return output using empty input with categories ordered by created_at", async () => {
    const models = await CategorySequelize.CategoryModel.factory().count(2).bulkCreate((index) => ({
      id: chance.guid({ version: 4 }),
      name: `Category ${index + 1}`,
      description: "some description",
      is_active: true,
      created_at: new Date(2020, 1, index + 1),
    }));
    const result = await useCase.execute({});

    expect(result).toMatchObject({
      items: [...models].reverse().map(CategorySequelize.CategoryMapper.toEntity).map((category) => category.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should return output using paginate, sort and filter", async () => {
    const items = await CategorySequelize.CategoryModel.factory().count(5).bulkMake();
    items[0].name = "a";
    items[1].name = "AAA";
    items[2].name = "AaA";
    items[3].name = "b";
    items[4].name = "c";

    await CategorySequelize.CategoryModel.bulkCreate(items.map((item) => item.toJSON()));

    let result = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "asc",
      filter: "a",
    });
    expect(result).toMatchObject({
      items: [items[1], items[2]].map(CategorySequelize.CategoryMapper.toEntity).map((category) => category.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    result = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      sort_dir: "asc",
      filter: "a",
    });
    expect(result).toMatchObject({
      items: [items[0]].map(CategorySequelize.CategoryMapper.toEntity).map((category) => category.toJSON()),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
  });
});
