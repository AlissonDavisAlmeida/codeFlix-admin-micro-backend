import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCategory, ListCategories } from 'micro-videos-core/category/application';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly createUseCase: CreateCategory,
    private readonly listUseCase: ListCategories
  ) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.createUseCase.execute(createCategoryDto)
    return category
    // return this.categoriesService.create(createCategoryDto);
  }


  @Get()
  findAll() {
    return this.listUseCase.execute({})
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
