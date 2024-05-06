import { Op } from "sequelize";
import { EntityNotFoundError } from "../../../../shared/domain/error/entity-not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { CategoryRepository, CategorySearchParamsInput, CategorySearchParamsResult, CategorySortBy } from "../../../data/category.repository";
import { Category } from "../../../domain/category.entity";
import { CategoryModel } from "./category.model";
import { CategoryModelMapper } from "./category-model-mapper";

export class CategoryRepositorySequelize implements CategoryRepository {
    sortableFields: Set<CategorySortBy> = new Set(["name", "created_at"]);

    constructor(
        private categoryModel: typeof CategoryModel
    ) { }

    async insert(entity: Category): Promise<void> {

        await this.categoryModel.create<CategoryModel>(CategoryModelMapper.toModel(entity).toJSON());
    }
    async bulkInsert(entities: Category[]): Promise<void> {
        await this.categoryModel.bulkCreate(entities.map(CategoryModelMapper.toModel).map((model) => model.toJSON()));
    }

    async update(entity: Category): Promise<void> {
        const id = entity.category_id.id;
        const model = await this._get(id);

        if (!model) {
            throw new EntityNotFoundError(id, this.getEntity());
        }


        await this.categoryModel.update(CategoryModelMapper.toModel(entity).toJSON(), {
            where: {
                category_id: id
            }

        });
    }
    async delete(id: Uuid): Promise<void> {
        const _id = id.id;

        const model = await this._get(_id);

        if (!model) {
            throw new EntityNotFoundError(_id, this.getEntity());
        }

        await this.categoryModel.destroy({
            where: {
                category_id: _id
            }
        });
    }

    async findById(entity_id: Uuid): Promise<Category | null> {
        const model = await this._get(entity_id.id);

        return model ? CategoryModelMapper.toEntity(model) : null;
    }

    private async _get(id: string) {
        return await this.categoryModel.findByPk(id);
    }

    async findAll(): Promise<Category[]> {
        const models = await this.categoryModel.findAll();

        return models.map(CategoryModelMapper.toEntity);
    }
    
    getEntity(): new (...args: any[]) => Category {
        return Category;
    }


    async search(props: CategorySearchParamsInput): Promise<CategorySearchParamsResult> {

        const offset = (props.page - 1) * props.perPage;
        const limit = props.perPage;

        const { count, rows } = await this.categoryModel.findAndCountAll({
            ...(props.filter && {
                where: {
                    name: {
                        [Op.like]: `%${props.filter}%`
                    }
                }
            }),
            ...(props.sortBy && this.sortableFields.has(props.sortBy)
                ? { order: [[props.sortBy, props.sortDirection]] }
                : { order: [["created_at", "desc"]] }
            ),
            offset,
            limit
        });

        return new CategorySearchParamsResult({
            current_page: props.page,
            per_page: props.perPage,
            total: count,
            items: rows.map(CategoryModelMapper.toEntity),
            last_page: Math.ceil(count / props.perPage)
        });

    }


}