import {
  Column, DataType, PrimaryKey, Table, Model,
} from "sequelize-typescript";

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
}
