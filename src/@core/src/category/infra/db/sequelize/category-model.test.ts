import { DataType, Sequelize } from "sequelize-typescript";
import CategoryModel from "./category-model";

describe("CategoryModel unit tests", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [CategoryModel],
    });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should test mapping props", () => {
    const attributes = CategoryModel.getAttributes();

    const keys = Object.keys(attributes);

    expect(keys).toStrictEqual([
      "id",
      "name",
      "description",
      "is_active",
      "created_at",
    ]);

    const idAttr = attributes.id;

    expect(idAttr).toMatchObject({
      primaryKey: true,
      field: "id",
      fieldName: "id",
      type: DataType.UUID(),
    });

    const nameAttr = attributes.name;

    expect(nameAttr).toMatchObject({
      allowNull: false,
      field: "name",
      fieldName: "name",
      type: DataType.STRING(255),
    });

    const descriptionAttr = attributes.description;

    expect(descriptionAttr).toMatchObject({
      allowNull: true,
      field: "description",
      fieldName: "description",
      type: DataType.TEXT(),
    });

    const isActiveAttr = attributes.is_active;

    expect(isActiveAttr).toMatchObject({
      allowNull: false,
      field: "is_active",
      fieldName: "is_active",
      type: DataType.BOOLEAN(),
    });

    const createdAtAttr = attributes.created_at;

    expect(createdAtAttr).toMatchObject({
      allowNull: false,
      field: "created_at",
      fieldName: "created_at",
      type: DataType.DATE(),
    });
  });

  it("should create a category", async () => {
    const arrange = {
      id: "74cc5a19-65c6-494f-ae6f-14a9b2e71005",
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
      created_at: new Date(),
    };

    const category = await CategoryModel.create(arrange);

    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
