export type ListCategoriesInputDTO = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: "asc" | "desc";
  filter?: string | null;
};
