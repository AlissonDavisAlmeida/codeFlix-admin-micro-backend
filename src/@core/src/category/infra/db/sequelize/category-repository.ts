import { Op } from "sequelize";
import { Category, CategoryRepository } from "../../../domain";
import { NotFoundError, UniqueEntityID } from "#seedwork/domain";
import { CategoryMapper } from "./category-mapper";
import CategoryModel from "./category-model";

export class CategorySequelizeRepository implements CategoryRepository.Repository {
  sortableFields: string[] = ["name", "created_at"];

  constructor(
    private categoryModel: typeof CategoryModel,
  ) { }

  async create(data: Category): Promise<void> {
    await this.categoryModel.create(data.toJSON());
  }

  async update(data: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string | UniqueEntityID): Promise<void> {
    throw new Error("Method not implemented.");
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
