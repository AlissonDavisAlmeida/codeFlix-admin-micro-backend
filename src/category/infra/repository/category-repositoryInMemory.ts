import { CategoryRepositoryInterface } from "category/domain/repository/category-repository";
import { Category } from "../../domain/entity/category";
import { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/inMemory.repository";

export class CategoryInMemoryRepository extends InMemorySearchableRepository<Category> implements CategoryRepositoryInterface {

}
