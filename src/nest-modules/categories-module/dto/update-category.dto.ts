import { UpdateCategoryInput } from "@core/category/application/update-category/update-category.usecase";
import { OmitType } from "@nestjs/mapped-types";

export class UpdateCategoryInputWithouId extends OmitType(UpdateCategoryInput, ["id"]) { }

export class UpdateCategoryDto  extends UpdateCategoryInputWithouId { }
