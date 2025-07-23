export interface PagedResult<T> {
  data: T[];
  desc?: string | null;
  isError?: boolean;
  statusCode?: number;
  errorMessage?: string | null;
  totalCount?: number;
}

export interface IRequestServerSide {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface IResultServerSide<T> {
  data: T | null;
  desc: string | null;
  isError: boolean;
  statusCode: number;
  errorMessage: string | null;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
