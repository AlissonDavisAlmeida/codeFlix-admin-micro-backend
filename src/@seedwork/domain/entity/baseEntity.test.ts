import { validate } from "uuid";
import { Category } from "../../../category/domain/entity/category";
import { UniqueIdentity } from "../valueObjects/unique_identity";

describe("Base Entity", () => {
  const id = new UniqueIdentity();
  const category = new Category({
    name: "Category",
    description: "description",
    isActive: true,
    createdAt: new Date(),
  }, id);

  it("should set props and id", () => {
    expect(category).toBeTruthy();
    expect(category.id).toEqual(id.value);
    expect(validate(category.id)).toBeTruthy();
    expect(category.uniqueEntityID).toBeInstanceOf(UniqueIdentity);
    expect(category.name).toBe("Category");
    expect(category.description).toBe("description");
    expect(category.isActive).toBe(true);
    expect(category.createdAt).toBeInstanceOf(Date);
  });

  it("should accept a valid uuid", () => {
    const arrange = {
      name: "Category",
      description: "description",
      isActive: true,
      createdAt: new Date(),
    };

    const entity = new Category(arrange, id);

    expect(entity).toBeTruthy();
    expect(entity.id).toEqual(id.value);
    expect(validate(entity.id)).toBeTruthy();
    expect(entity.uniqueEntityID).toBeInstanceOf(UniqueIdentity);
    expect(entity.name).toBe("Category");
  });

  it("should convert a entity to a JSON", () => {
    expect(category.toJSON()).toStrictEqual({
      id: category.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    });
  });
});
