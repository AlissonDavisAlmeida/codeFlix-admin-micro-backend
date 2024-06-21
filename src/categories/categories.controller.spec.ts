import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesController } from "./categories.controller";
import { CategoryModel, CategoryRepositorySequelize } from "@core/category/infra/db/sequelize";
import { SequelizeModule, getModelToken } from "@nestjs/sequelize";

describe("CategoriesController", () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: "sqlite",
          host: ":memory:",
          logging: false,
          models: [CategoryModel],
        }),
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
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
