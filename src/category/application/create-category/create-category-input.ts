import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidationError, validateSync } from "class-validator";

export type CreateCategoryInputConstructorProps = {
    name: string;
    description?: string | null;
    is_active?: boolean | null;
}

export class CreateCategoryInput {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string | null;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean | null;

    constructor(props: CreateCategoryInputConstructorProps) {
        if(!props){
            return;
        }
        Object.assign(this, props);
    }
}

export class ValidateCreateCategoryInput {
    public static validate(input: CreateCategoryInput): ValidationError[] {
        const errors = validateSync(input);

        return errors;

    }
}