import { CategoryRepository } from "category/domain/repository/category-repository";
import { UseCase } from "../../../@seedwork/application/useCase";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category.output";

type GetCategoryInputDTO = {
  id: string;
};

export class GetCategory implements UseCase<GetCategoryInputDTO, CategoryOutput> {
  constructor(private readonly categoryRepository: CategoryRepository.Repository) { }

  async execute(input: GetCategoryInputDTO): Promise<CategoryOutput> {
    const category = await this.categoryRepository.findById(input.id);

    return CategoryOutputMapper.toOutput(category);
  }
}
