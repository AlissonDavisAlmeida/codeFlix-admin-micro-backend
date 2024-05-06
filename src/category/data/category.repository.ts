import { SearchParamsInput, SearchParamsResult } from "../../shared/data";
import { SearchableRepository } from "../../shared/data/repository";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Category, CategoryConstructorProps } from "../domain/category.entity";

export type CategoryFilter = string;

export type CategorySortBy = keyof CategoryConstructorProps;

export class CategorySearchParamsInput extends SearchParamsInput<CategoryFilter, CategorySortBy> { }

export class CategorySearchParamsResult extends SearchParamsResult<Category> { }


export interface CategoryRepository extends SearchableRepository<
    Category,
    Uuid,
    CategoryFilter,
    CategorySortBy,
    CategorySearchParamsResult,
    CategorySearchParamsInput
> { }