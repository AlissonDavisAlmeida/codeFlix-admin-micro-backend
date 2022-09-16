import { Category } from "category/domain/entity/category";

export interface CategoryOutput {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  is_active: boolean;
}

export class CategoryOutputMapper {
  static toOutput(category: Category): CategoryOutput {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.createdAt,
    };
  }
}
