import { UseCaseInterface } from "../../../@seedwork/application/useCase";
import { CategoryRepository } from "../../domain/repositories/category-repository";

type DeleteCategoryInput = {
  id: string
};

type DeleteCategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

export class DeleteCategory implements UseCaseInterface<DeleteCategoryInput, any> {
  constructor(
    private categoryRepository: CategoryRepository.Repository,
  ) { }

  async execute(input: DeleteCategoryInput): Promise<void> {
    await this.categoryRepository.delete(input.id);
  }
}
