import {
  IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength,
} from "class-validator";
import { ClassValidator } from "../../../@seedwork/domain/validators/class-validator-field";
// eslint-disable-next-line import/no-cycle
import { CategoryState } from "../entity/category";

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
    name: string;

  @IsString()
  @IsOptional()
    description: string;

  @IsOptional()
  @IsBoolean()
    isActive: boolean;

  @IsDate()
  @IsOptional()
    created_at: Date;

  constructor(data: CategoryState) {
    Object.assign(this, data);
  }
}

export class CategoryValidator extends ClassValidator<CategoryRules> {
  validate(data: CategoryState): boolean {
    return super.validate(new CategoryRules(data));
  }
}

export class CategoryValidatorFactory {
  static create(): CategoryValidator {
    return new CategoryValidator();
  }
}
