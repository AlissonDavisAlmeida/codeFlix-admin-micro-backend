export type SearchInputDTO<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: "asc" | "desc" | null;
  filter?: Filter | null;
};
