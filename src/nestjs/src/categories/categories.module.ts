import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CreateCategory, DeleteCategory, GetCategory, ListCategories, UpdateCategory } from "micro-videos-core/category/application"
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
    },
    {
      provide: GetCategory,
      useFactory: (categoryRepository: CategoryRepository.Repository)=>{
        return new GetCategory(categoryRepository)
      },
      inject: ["CategoryInMemoryRepository"]
    },
    {
      provide: UpdateCategory,
      useFactory: (categoryRepository: CategoryRepository.Repository)=>{
        return new UpdateCategory(categoryRepository)
      },
      inject: ["CategoryInMemoryRepository"]
    },
    {
      provide: DeleteCategory,
      useFactory: (categoryRepository: CategoryRepository.Repository)=>{
        return new DeleteCategory(categoryRepository)
      },
      inject: ["CategoryInMemoryRepository"]
    }
  ]
})

export class CategoriesModule { }
