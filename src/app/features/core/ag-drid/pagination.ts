export interface IPaginationProperties {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    sortBy?: string;
    sortDirection?: string;
}