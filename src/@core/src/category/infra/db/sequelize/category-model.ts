import {
  Column, DataType, PrimaryKey, Table, Model,
} from "sequelize-typescript";
import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";

type CategoryModelProps = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

@Table({
  tableName: "categories",
  timestamps: false,
})
export default class CategoryModel extends Model<CategoryModelProps> {
  @PrimaryKey
  @Column({
    type: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(255),
  })
  declare name: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  declare description: string | null;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  declare is_active: boolean;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare created_at: Date;

  static factory() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const chance: Chance.Chance = require("chance")();

    return new SequelizeModelFactory(this, () => ({
      id: chance.guid({ version: 4 }),
      name: chance.name({ full: true }),
      description: chance.sentence({ words: 10 }),
      is_active: chance.bool(),
      created_at: chance.date(),
    }));
  }
}
