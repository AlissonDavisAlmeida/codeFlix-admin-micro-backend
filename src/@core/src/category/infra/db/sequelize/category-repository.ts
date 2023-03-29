import { Category, CategoryRepository } from "../../../domain";
import { NotFoundError, UniqueEntityID } from "#seedwork/domain";
import { CategoryMapper } from "./category-mapper";
import CategoryModel from "./category-model";

export class CategorySequelizeRepository implements CategoryRepository.Repository {
  sortableFields: string[] = ["name", "created_at"];

  constructor(
    private categoryModel: typeof CategoryModel,
  ) { }

  async search(params: CategoryRepository.SearchParams): Promise<CategoryRepository.SearchResults> {
    throw new Error("Method not implemented.");
  }

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
}
