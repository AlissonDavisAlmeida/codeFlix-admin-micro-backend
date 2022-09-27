import { Category } from "./Category";

describe("Category Entity", () => {
  it("should test constructor in category", () => {
    const props = {
      name: "Category Test",
      description: "Category Description",
      is_active: true,
      created_at: new Date(),
    };

    let category = new Category(props);

    expect(category.name).toBe("Category Test");
    expect(category.description).toBe("Category Description");
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);

    category = new Category({
      name: "Category Test",
    });

    expect(category.name).toBe("Category Test");
    expect(category.description).toBeNull();
    expect(category.is_active).toBeTruthy();
  });
});
