import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, HttpCode } from "@nestjs/common";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateCategoryOutput, CreateCategoryUseCase } from "@core/category/application/create-category/create-category.usecase";
import { UpdateCategoryUseCase } from "@core/category/application/update-category/update-category.usecase";
import { DeleteCategoryUseCase } from "@core/category/application/delete-category/delete-category.usecase";
import { GetCategoryUseCase } from "@core/category/application/get-category/get-category.usecase";
import { SearchCategoryUseCase } from "@core/category/application/search-category/search-category.usecase";
import { CreateCategoryInput } from "@core/category/application/create-category/create-category-input";
import { CategoryPresenter } from "./categories.presenter";

@Controller("categories")
export class CategoriesController {

  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUseCase: UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase;

  @Inject(SearchCategoryUseCase)
  private searchUseCase: SearchCategoryUseCase;


  @Post()
  async create(@Body() createCategoryDto: CreateCategoryInput) {
    const output = await this.createUseCase.execute(createCategoryDto);

    return CategoriesController.serialize(output);
  }

  @Get()
  findAll() {
  }

  @Get(":id")
  async findOne(@Param("id", new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    const output = await this.getUseCase.execute({ id });

    return output;
  }

  @Patch(":id")
  async update(
    @Param("id", new ParseUUIDPipe({
      errorHttpStatusCode: 422,
    })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto) {
    const output = await this.updateUseCase.execute({
      ...updateCategoryDto,
      id
    });

    return CategoriesController.serialize(output);
  }

  @HttpCode(204)
  @Delete(":id")
  async remove(@Param("id", new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    await this.deleteUseCase.execute({ id });
  }

  static serialize(output: CreateCategoryOutput) {
    return new CategoryPresenter(output);
  }
}
