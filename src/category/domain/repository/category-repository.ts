import { SearchableRepositoryInterface } from "@seedwork/domain/repository/repository.interface";
import { Category } from "../entity/category";

export interface CategoryRepositoryInterface extends SearchableRepositoryInterface<Category, any, any> {

}
