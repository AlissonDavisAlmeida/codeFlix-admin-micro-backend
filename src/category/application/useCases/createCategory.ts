import { UseCase } from "../../../@seedwork/application/useCase";
import { Category } from "../../domain/entity/category";
import { CategoryRepository } from "../../domain/repository/category-repository";
import { CategoryOutput } from "../dto/category.output";

interface ICreateCategoryInputDTO {
  name: string;
  description?: string;
  isActive?: boolean;
}

export class CreateCategory implements UseCase<ICreateCategoryInputDTO, CategoryOutput> {
  constructor(private readonly categoryRepository: CategoryRepository.Repository) {

  }

  async execute(input: ICreateCategoryInputDTO): Promise<CategoryOutput> {
    const category = new Category({ ...input });
    const categoryCreated = await this.categoryRepository.save(category);

    return {
      id: categoryCreated.id,
      name: categoryCreated.name,
      description: categoryCreated.description,
      is_active: categoryCreated.isActive,
      created_at: categoryCreated.createdAt,
    };
  }
}
