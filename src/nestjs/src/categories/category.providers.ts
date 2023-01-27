import { CreateCategory, DeleteCategory, GetCategory, ListCategories, UpdateCategory } from "micro-videos-core/category/application";
import { CategoryRepositoryInMemory } from "micro-videos-core/category/infra";
import { CategoryRepository } from "micro-videos-core/dist/category/domain/repositories/category-repository";

export namespace CATEGORY_PROVIDERS {


    export namespace REPOSITORIES {
        export const CATEGORY_IN_MEMORY = {
            provide: "CategoryInMemoryRepository",
            useClass: CategoryRepositoryInMemory
        }
    }

    export namespace USE_CASES {
        export const CREATE_CATEGORY = {
            provide: CreateCategory,
            useFactory: (categoryRepository: CategoryRepository.Repository) => {
                return new CreateCategory(categoryRepository)
            },
            inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide]
        }

        export const LIST_CATEGORIES = {
            provide: ListCategories,
            useFactory: (categoryRepository: CategoryRepository.Repository) => {
                return new ListCategories(categoryRepository)
            },
            inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide]
        }

        export const GET_CATEGORY = {
            provide: GetCategory,
            useFactory: (categoryRepository: CategoryRepository.Repository) => {
                return new GetCategory(categoryRepository)
            },
            inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide]
        }

        export const UPDATE_CATEGORY = {
            provide: UpdateCategory,
            useFactory: (categoryRepository: CategoryRepository.Repository) => {
                return new UpdateCategory(categoryRepository)
            },
            inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide]
        }

        export const DELETE_CATEGORY = {
            provide: DeleteCategory,
            useFactory: (categoryRepository: CategoryRepository.Repository) => {
                return new DeleteCategory(categoryRepository)
            },
            inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide]
        }
    }


}