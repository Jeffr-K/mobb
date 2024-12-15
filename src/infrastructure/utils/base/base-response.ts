export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}
