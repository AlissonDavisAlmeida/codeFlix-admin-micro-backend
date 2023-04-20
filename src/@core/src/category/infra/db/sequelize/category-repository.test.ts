import { NotFoundError, UniqueEntityID } from "#seedwork/domain";
import { Category } from "../../../domain";
import CategoryModel from "./category-model";
import { CategorySequelizeRepository } from "./category-repository";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

describe("Sequelize - Category repository unit tests", () => {
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

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

  it("search", async () => {
    await CategoryModel.factory().create();

    const categories = await repository.findAll();
  });
});
