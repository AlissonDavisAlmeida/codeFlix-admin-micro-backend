import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CreateCategory, ListCategories } from "micro-videos-core/category/application"
import {CategoryRepositoryInMemory} from "micro-videos-core/category/infra"
import { CategoryRepository } from 'micro-videos-core/dist/category/domain/repositories/category-repository';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: "CategoryInMemoryRepository",
      useClass: CategoryRepositoryInMemory
    },
    {
      provide: CreateCategory,
      useFactory: (categoryRepository: CategoryRepository.Repository)=>{
        return new CreateCategory(categoryRepository)
      },
      inject: ["CategoryInMemoryRepository"]
    },
    {
      provide: ListCategories,
      useFactory: (categoryRepository: CategoryRepository.Repository)=>{
        return new ListCategories(categoryRepository)
      },
      inject: ["CategoryInMemoryRepository"]
    }
  ]
})

export class CategoriesModule { }
