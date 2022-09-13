import { Category } from "../../domain/entity/category";
import { CategoryRepository } from "../../domain/repository/category-repository";

interface ICreateCategoryInputDTO {
  name: string;
  description?: string;
  isActive?: boolean;
}

interface ICreateCategoryOutputDTO {
  id: string
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
}

export class CreateCategory {
  constructor(private readonly categoryRepository: CategoryRepository.Repository) {

  }

  async execute(input: ICreateCategoryInputDTO): Promise<ICreateCategoryOutputDTO> {
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
