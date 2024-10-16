import { Module } from "@nestjs/common";
import { ConfigModule } from "./nest-modules/config/config.module";
import { DatabaseModule } from "./nest-modules/database/database.module";
import { CategoriesModule } from "./nest-modules/categories-module/categories.module";
import { SharedModule } from "./nest-modules/shared/shared.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    SharedModule
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule { }
