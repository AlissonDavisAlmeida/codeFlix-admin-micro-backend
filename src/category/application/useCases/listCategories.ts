import { CategoryRepository } from "../../domain/repository/category-repository";
import { UseCase } from "../../../@seedwork/application/useCase";
import { CategoryOutput } from "../dto/category.output";
import { ListCategoriesInputDTO } from "../../../@seedwork/application/dto/searchInputDTO";

export class ListCategories implements UseCase<ListCategoriesInputDTO, CategoryOutput[]> {
  constructor(private readonly categoryRepository: CategoryRepository.Repository) { }

  async execute(input: ListCategoriesInputDTO): Promise<CategoryOutput[]> {
    const params = new CategoryRepository.SearchParams(input);
    const categories = await this.categoryRepository.search(params);
  }
}
