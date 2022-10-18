import { UniqueEntityID } from "../../../@seedwork/domain/value-objects/uniqueEntityID";
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

    category = new Category({
      name: "Category Test",
      description: null,
      is_active: true,
    });
    expect(category.name).toBe("Category Test");
    expect(category.description).toBeNull();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);
  });

  it("should test id field", () => {
    const data: { props:{ name:string }, id?: UniqueEntityID }[] = [
      {
        props: { name: "Category" },
      },
      {
        props: { name: "Category" },
        id: null,
      },
      {
        props: { name: "Category" },
        id: undefined,
      },
      {
        props: { name: "Category" },
        id: new UniqueEntityID(),
      },
    ];

    data.forEach((item) => {
      const category = new Category(item.props, item.id);
      expect(category.id).toBeTruthy();
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityID);
    });
  });

  it("should test getter of name field", () => {
    const category = new Category({
      name: "Category Test",
    });

    expect(category.name).toBe("Category Test");
  });

  it("should test getter and of description field", () => {
    let category = new Category({
      name: "Category Test",
    });

    expect(category.description).toBeNull();

    category = new Category({
      name: "Category Test",
      description: "Category Description",
    });
    expect(category.description).toBe("Category Description");

    category = new Category({
      name: "Category Test",
      description: "Category Description",
    });

    category["description"] = "Category Description";
    expect(category.description).toBe("Category Description");
  });

  it("should test getter of is_active field", () => {
    let category = new Category({
      name: "Category Test",
    });
    expect(category.is_active).toBeTruthy();

    category = new Category({
      name: "Category Test",
      is_active: false,
    });
    expect(category.is_active).toBeFalsy();

    category = new Category({
      name: "Category Test",
      is_active: true,
    });
    expect(category.is_active).toBeTruthy();
  });

  it("should test getter of created_at field", () => {
    let category = new Category({
      name: "Category Test",
    });
    expect(category.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    category = new Category({
      name: "Category Test",
      created_at,
    });
    expect(category.created_at).toBe(created_at);
  });

  it("should update category", () => {
    const category = new Category({ name: "Category Test" });

    category.update("Category Test 2", "Category Description 2");

    expect(category.name).toBe("Category Test 2");
    expect(category.description).toBe("Category Description 2");
  });

  it("should active a category", () => {
    const category = new Category({ name: "Category Test", is_active: false });

    category.activate();

    expect(category.is_active).toBeTruthy();
  });

  it("should inactive a category", () => {
    const category = new Category({ name: "Category Test", is_active: true });

    category.deactivate();

    expect(category.is_active).toBeFalsy();
  });
});
