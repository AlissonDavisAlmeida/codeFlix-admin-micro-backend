import { UseCaseInterface } from "../../../@seedwork/application/useCase";
import { CategoryRepository } from "../../domain/repositories/category-repository";

type UpdateCategoryInput = {
  id: string
  name: string
  description?: string
  is_active?: boolean
};

type UpdateCategoryOutput = {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  is_active?: boolean
};

export class UpdateCategory implements UseCaseInterface<UpdateCategoryInput, UpdateCategoryOutput> {
  constructor(
    private categoryRepository: CategoryRepository.Repository,
  ) { }

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const category = await this.categoryRepository.findById(input.id);

    category.update(input.name, input.description);

    if (input.is_active === true) {
      category.activate();
    }

    if (input.is_active === false) {
      category.deactivate();
    }

    await this.categoryRepository.update(category);

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      created_at: category.created_at,
      is_active: category.is_active,
    };
  }
}
