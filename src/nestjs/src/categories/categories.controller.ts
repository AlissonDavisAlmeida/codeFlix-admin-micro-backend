import { Controller, Get, Post, Body, Param, Delete, Inject, Put, HttpCode, Query } from '@nestjs/common';
import { CreateCategory, ListCategories, GetCategory, UpdateCategory, DeleteCategory } from 'micro-videos-core/category/application';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {

  @Inject(CreateCategory)
  private createUseCase: CreateCategory

  @Inject(ListCategories)
  private readonly listUseCase: ListCategories

  @Inject(GetCategory)
  private readonly getUseCase: GetCategory

  @Inject(UpdateCategory)
  private readonly updateUseCase: UpdateCategory

  @Inject(DeleteCategory)
  private readonly deleteUseCase: DeleteCategory


  
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.createUseCase.execute(createCategoryDto)
  }


  @Get()
  search(@Query() searchParams: SearchCategoryDto) {
    return this.listUseCase.execute(searchParams)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getUseCase.execute({ id })
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.updateUseCase.execute({ id, ...updateCategoryDto })
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute({ id })
  }
}
