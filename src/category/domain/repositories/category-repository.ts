import { SearchableRepositoryInterface } from "@seedwork/domain/repository/repository-contract";
import { Category } from "../entities/Category";

export interface CategoryRepository extends SearchableRepositoryInterface<Category, any, any> {

}
