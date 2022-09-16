import { PaginationOutputDTO, PaginationOutputMapper } from "@seedwork/application/dto/pagination-output.dto";
import { CategoryRepository } from "../../domain/repository/category-repository";
import { UseCase } from "../../../@seedwork/application/useCase";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category.output";
import { ListCategoriesInputDTO } from "../../../@seedwork/application/dto/searchInputDTO";

export class ListCategories implements UseCase<ListCategoriesInputDTO, Output> {
  constructor(private readonly categoryRepository: CategoryRepository.Repository) { }

  async execute(input: ListCategoriesInputDTO): Promise<Output> {
    const params = new CategoryRepository.SearchParams(input);
    const searchResult = await this.categoryRepository.search(params);

    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategoryRepository.SearchResult): Output {
    return {
      items: searchResult.items.map((category) => CategoryOutputMapper.toOutput(category)),
      ...PaginationOutputMapper.toPaginationOutput(searchResult),
    };
  }
}

export type Output = PaginationOutputDTO<CategoryOutput>;
