import { CategoryRepository } from "category/domain/repository/category-repository";
import { CategoryOutput } from "../dto/category.output";

type GetCategoryInputDTO = {
  id: string;
};

export class GetCategory {
  constructor(private readonly categoryRepository: CategoryRepository.Repository) {}

  async execute(input: GetCategoryInputDTO): Promise<CategoryOutput> {
    const category = await this.categoryRepository.findById(input.id);

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      created_at: category.createdAt,
      is_active: category.isActive,
    };
  }
}
