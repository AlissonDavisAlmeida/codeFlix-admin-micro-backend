import { UseCaseInterface } from "#seedwork/application/useCase";
import { CategoryRepository } from "../../domain/repositories/category-repository";
import { Category } from "../../domain/entities/Category";

type CreateCategoryInput = {
  name: string;
  description?: string;
  is_active?: boolean;
};

type CreateCategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

export class CreateCategory implements UseCaseInterface<CreateCategoryInput, CreateCategoryOutput> {
  constructor(
    private categoryRepository: CategoryRepository.Repository,
  ) { }

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = new Category(input);

    await this.categoryRepository.create(category);

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    };
  }
}
