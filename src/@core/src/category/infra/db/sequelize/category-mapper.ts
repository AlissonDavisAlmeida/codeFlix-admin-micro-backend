import { Category } from "../../../domain";
import { EntityValidationError, UniqueEntityID, LoadingEntityError } from "#seedwork/domain";
import CategoryModel from "./category-model";

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
