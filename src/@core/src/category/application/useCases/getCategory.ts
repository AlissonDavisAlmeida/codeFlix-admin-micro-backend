import { UseCaseInterface } from "../../../@seedwork/application/useCase";
import { CategoryRepository } from "../../domain/repositories/category-repository";

export type GetCategoryInput = {
  id: string
};

export type GetCategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

export class GetCategory implements UseCaseInterface<GetCategoryInput, GetCategoryOutput> {
  constructor(
    private categoryRepository: CategoryRepository.Repository,
  ) { }

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const category = await this.categoryRepository.findById(input.id);

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    };
  }
}
