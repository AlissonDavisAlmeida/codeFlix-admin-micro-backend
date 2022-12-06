export type PaginationOutputDTO<GenericItems> = {
  per_page?: number;
  total?: number;
  last_page?: number;
  current_page?: number;
  items?: GenericItems[];
};
