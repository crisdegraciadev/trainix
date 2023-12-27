export type Paginated<T> = {
  resource: T;
  count: number;
  pages: number;
  current: number;
};
