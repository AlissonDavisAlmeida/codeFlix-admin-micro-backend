import { CategoryRepository } from "category/domain/repositories/category-repository";
import { Category } from "../../domain/entities/Category";
import { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/inMemoryRepository";

export class CategoryRepositoryInMemory extends InMemorySearchableRepository<Category> implements CategoryRepository {

}
