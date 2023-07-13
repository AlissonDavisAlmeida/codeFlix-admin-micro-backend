import {
  Column, DataType, PrimaryKey, Table, Model,
} from "sequelize-typescript";
import { Op } from "sequelize";
import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";

import { Category, CategoryRepository } from "../../../domain";
import {
  NotFoundError, UniqueEntityID, EntityValidationError, LoadingEntityError,
} from "#seedwork/domain";

export namespace CategorySequelize {

  type CategoryModelProps = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;
  };

  export class CategoryMapper {
    static toEntity(model: CategoryModel) {
      const { id, ...params } = model.toJSON();
      try {
        return new Category(params, new UniqueEntityID(id));
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadingEntityError(e.error, e.message);
        }

        throw e;
      }
    }
  }

  @Table({
    tableName: "categories",
    timestamps: false,
  })
  export class CategoryModel extends Model<CategoryModelProps> {
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
      allowNull: true,
      type: DataType.DATE,
    })
    declare created_at: Date;

    static factory() {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
      const chance: Chance.Chance = require("chance")();

      return new SequelizeModelFactory<CategoryModel>(this, () => ({
        id: chance.guid({ version: 4 }),
        name: chance.name({ full: true }),
        description: chance.sentence({ words: 10 }),
        is_active: chance.bool(),
        created_at: chance.date(),
      }));
    }
  }

  export class CategorySequelizeRepository implements CategoryRepository.Repository {
    sortableFields: string[] = ["name", "created_at"];

    constructor(
      private categoryModel: typeof CategoryModel,
    ) { }

    async create(data: Category): Promise<void> {
      await this.categoryModel.create(data.toJSON());
    }

    async update(data: Category): Promise<void> {
      const _id = `${data.id}`;
      await this._get(_id);

      await this.categoryModel.update(data.toJSON(), {
        where: {
          id: _id,
        },
      });
    }

    async delete(id: string | UniqueEntityID): Promise<void> {
      const _id = `${id}`;

      await this._get(_id);

      this.categoryModel.destroy({
        where: {
          id: _id,
        },
      });
    }

    async findById(id: string | UniqueEntityID): Promise<Category> {
      const _id = `${id}`;

      const category = await this._get(_id);

      return category;
    }

    async findAll(): Promise<Category[]> {
      const models = await this.categoryModel.findAll();
      return models.map(CategoryMapper.toEntity);
    }

    private async _get(id: string): Promise<Category> {
      const model = await this.categoryModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using id: ${id}`),
      });

      const category = CategoryMapper.toEntity(model);

      return category;
    }

    async search(params: CategoryRepository.SearchParams): Promise<CategoryRepository.SearchResults> {
      const offset = (params.page - 1) * params.per_page;
      const limit = params.per_page;

      const { count, rows: models } = await this.categoryModel.findAndCountAll({
        ...(params.filter && {
          where: {
            name: {
              [Op.like]: `%${params.filter}%`,
            },
          },
        }),
        ...(params.sort && this.sortableFields.includes(params.sort) ? {
          order: [[params.sort, params.sort_dir]],
        } : {
          order: [["created_at", "DESC"]],
        }),
        offset,
        limit,
      });
      return new CategoryRepository.SearchResults({
        items: models.map(CategoryMapper.toEntity),
        current_page: params.page,
        per_page: params.per_page,
        total: count,
        filter: params.filter,
        sort: params.sort,
        sort_dir: params.sort_dir,
      });
    }
  }

}
