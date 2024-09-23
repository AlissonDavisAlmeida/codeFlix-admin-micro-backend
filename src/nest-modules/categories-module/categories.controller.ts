import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateCategoryUseCase } from "@core/category/application/create-category/create-category.usecase";
import { UpdateCategoryUseCase } from "@core/category/application/update-category/update-category.usecase";
import { DeleteCategoryUseCase } from "@core/category/application/delete-category/delete-category.usecase";
import { GetCategoryUseCase } from "@core/category/application/get-category/get-category.usecase";
import { SearchCategoryUseCase } from "@core/category/application/search-category/search-category.usecase";

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
  create(@Body() createCategoryDto: CreateCategoryDto) {
  }

  @Get()
  findAll() {
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
  }
}
