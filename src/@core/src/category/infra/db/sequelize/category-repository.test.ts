import _chance from "chance";
import { NotFoundError, UniqueEntityID } from "#seedwork/domain";
import { Category, CategoryRepository } from "../../../domain";
import CategoryModel from "./category-model";
import { CategorySequelizeRepository } from "./category-repository";
import { CategoryMapper } from "./category-mapper";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

let change: Chance.Chance;
describe("Sequelize - Category repository unit tests", () => {
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeAll(() => {
    change = _chance();
  });

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should insert a new Entity", async () => {
    let category = new Category({
      name: "Movie 1",
      description: "Movie 1 description",
      created_at: new Date(),
      is_active: true,
    });

    await repository.create(category);

    const model = await CategoryModel.findByPk(category.id);

    expect(model).not.toBeNull();
    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it("throws error when entity not found", async () => {
    await expect(repository.findById("1")).rejects.toThrow(
      new NotFoundError("Entity not found using id: 1"),
    );

    const uniqueEntityID = new UniqueEntityID();

    await expect(repository.findById(uniqueEntityID.value)).rejects.toThrow(
      new NotFoundError(`Entity not found using id: ${uniqueEntityID.value}`),
    );
  });

  it("should finds a entity by id", async () => {
    const stubEntity = new Category({
      name: "Movie 1", created_at: new Date(), is_active: true, description: null,
    });
    await repository.create(stubEntity);

    let entityFound = await repository.findById(stubEntity.id);
    expect(entityFound.toJSON()).toStrictEqual(stubEntity.toJSON());

    entityFound = await repository.findById(stubEntity.uniqueEntityId);
    expect(entityFound.toJSON()).toStrictEqual(stubEntity.toJSON());
  });

  it("should finds all entities", async () => {
    const entity = new Category({
      name: "Movie 1", created_at: new Date(), is_active: true, description: null,
    });

    await repository.create(entity);

    const entitiesFound = await repository.findAll();

    expect(entitiesFound).toHaveLength(1);
    expect(entitiesFound[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  describe("search method tests", () => {
    it("should only apply paginate when other params are null", async () => {
      const created_at = new Date();
      await CategoryModel.factory().count(16).bulkCreate(() => ({
        id: change.guid({ version: 4 }),
        name: "Movie",
        description: null,
        is_active: true,
        created_at,
      }));

      const spyToEntity = jest.spyOn(CategoryMapper, "toEntity");

      const result = await repository.search(new CategoryRepository.SearchParams());

      expect(spyToEntity).toHaveBeenCalledTimes(15);

      expect(result).toBeInstanceOf(CategoryRepository.SearchResults);
      expect(result.toJSON()).toMatchObject({
        per_page: 15,
        total: 16,
        current_page: 1,
        sort: null,
        sort_dir: null,
        filter: null,
        last_page: 2,
      } as CategoryRepository.SearchResults);

      result.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
      });

      expect(result.items).toHaveLength(15);
      const items = result.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: "Movie",
          description: null,
          is_active: true,
          created_at,
        }),
      );
    });

    it("should order by created_at DESC when search params are null", async () => {
      await CategoryModel.factory().count(16).bulkCreate((index) => ({
        id: change.guid({ version: 4 }),
        name: `Movie-${index}`,
        description: null,
        is_active: true,
        created_at: new Date(new Date().getTime() + index),
      }));

      const result = await repository.search(new CategoryRepository.SearchParams());

      result.items.reverse().forEach((item, index) => {
        expect(item).toBeInstanceOf(Category);
        expect(`${item.name}`).toBe(`Movie-${index + 1}`);
      });
    });

    it("should apply paginate and filter", async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };

      const categoriesProp = [
        { id: change.guid({ version: 4 }), name: "test", ...defaultProps },
        { id: change.guid({ version: 4 }), name: "a", ...defaultProps },
        { id: change.guid({ version: 4 }), name: "TEST", ...defaultProps },
        { id: change.guid({ version: 4 }), name: "TeSt", ...defaultProps },
      ];

      const categories = await CategoryModel.bulkCreate(categoriesProp);

      let result = await repository.search(new CategoryRepository.SearchParams({
        page: 1,
        per_page: 2,
        filter: "TEST",
      }));

      expect(result.toJSON(true)).toMatchObject(new CategoryRepository.SearchResults({
        items: [categories[0], categories[2]].map(CategoryMapper.toEntity),
        current_page: 1,
        per_page: 2,
        total: 3,
        sort: null,
        sort_dir: null,
        filter: "TEST",
      }).toJSON(true));

      result = await repository.search(new CategoryRepository.SearchParams({
        page: 2,
        per_page: 2,
        filter: "TEST",
      }));

      expect(result.toJSON(true)).toMatchObject(new CategoryRepository.SearchResults({
        items: [categories[3]].map(CategoryMapper.toEntity),
        current_page: 2,
        per_page: 2,
        total: 3,
        sort: null,
        sort_dir: null,
        filter: "TEST",
      }).toJSON(true));
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

      const defaultProps = {
        description: null,
        is_active: true,
      };

      const categoriesProp = [
        { id: change.guid({ version: 4 }), name: "b", ...({ ...defaultProps, created_at: new Date("2020/10/01") }) },
        { id: change.guid({ version: 4 }), name: "a", ...({ ...defaultProps, created_at: new Date("2020/10/02") }) },
        { id: change.guid({ version: 4 }), name: "c", ...({ ...defaultProps, created_at: new Date("2020/10/03") }) },
        { id: change.guid({ version: 4 }), name: "d", ...({ ...defaultProps, created_at: new Date("2020/10/04") }) },
      ];

      const categories = await CategoryModel.bulkCreate(categoriesProp);

      let result = await repository.search(new CategoryRepository.SearchParams({
        page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",

      }));

      expect(result.toJSON(true)).toMatchObject(new CategoryRepository.SearchResults({
        items: [categories[1], categories[0]].map(CategoryMapper.toEntity),
        current_page: 1,
        per_page: 2,
        total: 4,
        sort: "name",
        sort_dir: "asc",
        filter: null,

      }).toJSON(true));

      result = await repository.search(new CategoryRepository.SearchParams({
        page: 2,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
      }));

      expect(result.toJSON(true)).toMatchObject(new CategoryRepository.SearchResults({
        items: [categories[2], categories[3]].map(CategoryMapper.toEntity),
        current_page: 2,
        per_page: 2,
        total: 4,
        sort: "name",
        sort_dir: "asc",
        filter: null,
      }).toJSON(true));

      result = await repository.search(new CategoryRepository.SearchParams({
        page: 1,
        per_page: 2,
        sort: "is_active",
        sort_dir: "desc",
      }));

      expect(result.toJSON(true)).toMatchObject(new CategoryRepository.SearchResults({
        items: [categories[3], categories[2]].map(CategoryMapper.toEntity),
        current_page: 1,
        per_page: 2,
        total: 4,
        sort: "is_active",
        sort_dir: "desc",
        filter: null,
      }).toJSON(true));
    });

    it("should apply paginate, filter and sort", async () => {
      const defaultProps = {
        description: null,
        is_active: true,
      };

      const categoriesProp = [

        {
          id: change.guid({ version: 4 }), name: "test", ...defaultProps, created_at: new Date("2020/10/01"),
        },
        {
          id: change.guid({ version: 4 }), name: "a", ...defaultProps, created_at: new Date("2020/10/02"),
        },
        {
          id: change.guid({ version: 4 }), name: "TEST", ...defaultProps, created_at: new Date("2020/10/03"),
        },
        {
          id: change.guid({ version: 4 }), name: "TeSt", ...defaultProps, created_at: new Date("2020/10/04"),
        },
        {
          id: change.guid({ version: 4 }), name: "e", ...defaultProps, created_at: new Date("2020/10/05"),
        },
      ];

      const categories = await CategoryModel.bulkCreate(categoriesProp);

      const arrange = [{

        params: new CategoryRepository.SearchParams({
          page: 1,
          per_page: 2,
          sort: "name",
          filter: "TEST",
        }),
        result: new CategoryRepository.SearchResults({
          items: [categories[2], categories[3]].map(CategoryMapper.toEntity),
          current_page: 1,
          per_page: 2,
          total: 3,
          sort: "name",
          sort_dir: "asc",
          filter: "TEST",
        }),
      },
      {
        params: new CategoryRepository.SearchParams({
          page: 2,
          per_page: 2,
          sort: "name",
          filter: "TEST",
        }),
        result: new CategoryRepository.SearchResults({
          items: [categories[0]].map(CategoryMapper.toEntity),
          current_page: 2,
          per_page: 2,
          total: 3,
          sort: "name",
          sort_dir: "asc",
          filter: "TEST",
        }),
      },
      ];

      for (const { params, result } of arrange) {
        const actual = await repository.search(params);
        expect(actual.toJSON(true)).toMatchObject(result.toJSON(true));
      }
    });
  });
});
