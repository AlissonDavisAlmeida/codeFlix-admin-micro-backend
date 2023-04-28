import {
  Model, Table, Column, PrimaryKey, DataType, Sequelize,
} from "sequelize-typescript";
import chance from "chance";
import { validate } from "uuid";
import { SequelizeModelFactory } from "./sequelize-model-factory";
import { setupSequelize } from "../testing/helpers/db";

const chanceFake = chance();

@Table({})
class StubModel extends Model<{ id: string, name: string }> {
  @PrimaryKey
  @Column({ type: DataType.UUIDV4 })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  static mockFactory = jest.fn(() => ({

    id: chanceFake.guid({ version: 4 }),
    name: chanceFake.name({ full: true }),
  }));

  static factory() {
    return new SequelizeModelFactory(this, StubModel.mockFactory);
  }
}

describe("SequelizeModelFactory - repository unit tests", () => {
  setupSequelize({
    models: [StubModel],
  });
  test("create method", async () => {
    let model = await StubModel.factory().create();

    expect(validate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalledTimes(1);

    const modelFound = await StubModel.findByPk(model.id);

    expect(modelFound).not.toBeNull();
    expect(model.id).toBe(modelFound.id);

    model = await StubModel.factory().create({
      id: "d7c7a8d6-7c6b-4e1f-9b2e-5b7c9f9d1e2f",
      name: "Test",
    });

    expect(model.id).toBe("d7c7a8d6-7c6b-4e1f-9b2e-5b7c9f9d1e2f");
    expect(model.name).toBe("Test");

    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });
  test("make method", async () => {
    let model = await StubModel.factory().make();

    expect(validate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalledTimes(1);

    model = StubModel.factory().make({
      id: "d7c7a8d6-7c6b-4e1f-9b2e-5b7c9f9d1e2f",
      name: "Test",
    });

    expect(model.id).toBe("d7c7a8d6-7c6b-4e1f-9b2e-5b7c9f9d1e2f");
    expect(model.name).toBe("Test");

    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });

  test("bulkCreate method using count = 1", async () => {
    let models = await StubModel.factory().bulkCreate();
    expect(models).toHaveLength(1);
  });
});
