import { Category } from "../../domain/entity/category";
import { CategoryOutputMapper } from "./category.output";

describe("CategoryOutputMapper", () => {
  it("should convert a category in output dto", () => {
    const category = new Category({
      name: "Category 1",
      description: "Category 1 description",
      isActive: true,
      createdAt: new Date(),
    });

    const output = CategoryOutputMapper.toOutput(category);

    expect(output).toEqual({
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.createdAt,
    });
  });
});
