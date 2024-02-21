import { Repository } from "../../shared/data/repository";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "../domain/category.entity";

export interface CategoryRepository extends Repository<Category, Uuid>{}