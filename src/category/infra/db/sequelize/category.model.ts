import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Optional } from "sequelize";

export interface CategoryAttributes{
    category_id: string;
    created_at: Date;
    description: string | null;
    is_active: boolean;
    name: string;
}

interface CategoryAttributesCreation extends Optional<CategoryAttributes, "category_id"> {}


@Table({ tableName: "categories", timestamps: false })
export class CategoryModel extends Model<CategoryAttributes, CategoryAttributesCreation> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare category_id: string;

    @Column({ type: DataType.DATE(3) })
    declare created_at: Date;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare description: string | null;

    @Column({ type: DataType.BOOLEAN })
    declare is_active: boolean;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare name: string;

    
}