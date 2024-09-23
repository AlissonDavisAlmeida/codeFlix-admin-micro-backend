import { CreateCategoryUseCase } from "@core/category/application/create-category/create-category.usecase";
import { DeleteCategoryUseCase } from "@core/category/application/delete-category/delete-category.usecase";
import { GetCategoryUseCase } from "@core/category/application/get-category/get-category.usecase";
import { SearchCategoryUseCase } from "@core/category/application/search-category/search-category.usecase";
import { UpdateCategoryUseCase } from "@core/category/application/update-category/update-category.usecase";
import { CategoryRepository } from "@core/category/data/category.repository";
import { CategoryInMemoryRepository } from "@core/category/infra/db/in-memory/category-in-memory.repository";
import { CategoryModel, CategoryRepositorySequelize } from "@core/category/infra/db/sequelize";
import { getModelToken } from "@nestjs/sequelize";

export const REPOSITORIES = {
    CATEGORY_REPOSITORY:{
        provide: "CategoryRepository",
        useExisting: CategoryRepositorySequelize
    },
    CATEGORY_IN_MEMORY_REPOSITORY:{
        provide: CategoryInMemoryRepository,
        useClass: CategoryInMemoryRepository
    },
    CATEGORY_SEQUELIZE_REPOSITORY:{
        provide: CategoryRepositorySequelize,
        useFactory: (categoryModel: typeof CategoryModel) =>{
            return new CategoryRepositorySequelize(categoryModel);
        },
        Inject: [getModelToken(CategoryModel)]
    }

};

export const USE_CASES = {
    CREATE_CATEGORY_USE_CASE: {
      provide: CreateCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new CreateCategoryUseCase(categoryRepo);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    },
    UPDATE_CATEGORY_USE_CASE: {
      provide: UpdateCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new UpdateCategoryUseCase(categoryRepo);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    },
    LIST_CATEGORIES_USE_CASE: {
      provide: SearchCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new SearchCategoryUseCase(categoryRepo);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    },
    GET_CATEGORY_USE_CASE: {
      provide: GetCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new GetCategoryUseCase(categoryRepo);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    },
    DELETE_CATEGORY_USE_CASE: {
      provide: DeleteCategoryUseCase,
      useFactory: (categoryRepo: CategoryRepository) => {
        return new DeleteCategoryUseCase(categoryRepo);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    },
  };

export const CATEGORY_PROVIDERS = {
    REPOSITORIES,
    USE_CASES
};