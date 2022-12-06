import { UseCaseInterface } from "@seedwork/application/useCase";

type UpdateCategoryInput = {
  name: string
};

type UpdateCategoryOutput = {
  name: string
};

export class UpdateCategory implements UseCaseInterface<UpdateCategoryInput, UpdateCategoryOutput> {
  execute(input: UpdateCategoryInput): UpdateCategoryOutput | Promise<UpdateCategoryOutput> {
    throw new Error("Method not implemented.");
  }
}
