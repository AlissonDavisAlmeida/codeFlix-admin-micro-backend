import { Category } from "../../../domain";
import { UniqueEntityID } from "#seedwork/domain";
import CategoryModel from "./category-model";

export class CategoryMapper {
  static toEntity(model: CategoryModel): Category {
    const { id, ...params } = model.toJSON();

    return new Category(params, new UniqueEntityID(id));
  }
}
