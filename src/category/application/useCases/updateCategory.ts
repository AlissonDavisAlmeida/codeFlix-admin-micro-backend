import { CategoryRepository } from "../../domain/repository/category-repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category.output";

type UpdateCategoryDTO = {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
};

export class UpdateCategory {
  constructor(private readonly categoryRepository:CategoryRepository.Repository) {}

  async execute(input : UpdateCategoryDTO):Promise<CategoryOutput> {
    const category = await this.categoryRepository.findById(input.id);

    category.update({ name: input.name, description: input.description });

    if (input.is_active === true) {
      category.activate();
    }

    if (input.is_active === false) {
      category.deactivate();
    }

    await this.categoryRepository.update(category);

    return CategoryOutputMapper.toOutput(category);
  }
}
