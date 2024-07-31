import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { SequelizeModule, getModelToken } from "@nestjs/sequelize";
import { CategoryRepositorySequelize, CategoryModel } from "@core/category/infra/db/sequelize";

@Module({
  imports: [
    SequelizeModule.forFeature([CategoryModel]),
  ],
  controllers: [CategoriesController],
  providers: [
    {
      provide: CategoryRepositorySequelize,
      useFactory: (categoryModel: typeof CategoryModel) => new CategoryRepositorySequelize(categoryModel),
      inject: [getModelToken(CategoryModel)],
    }
  ],
})
export class CategoriesModule { }
