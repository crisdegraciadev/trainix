export type PageParams = {
  take: number;
  skip: number;
};

export type Page<T> = {
  values: T[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  pageOffset: number;
};

export type Order = "asc" | "desc";
