import { CategoryRepositoryInterface } from "category/domain/repository/category-repository";
import { Category } from "../../domain/entity/category";
import { InMemoryRepository } from "../../../@seedwork/domain/repository/inMemory.repository";

export class CategoryInMemoryRepository extends InMemoryRepository<Category> implements CategoryRepositoryInterface {

}
