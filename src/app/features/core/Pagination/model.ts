export interface IPaginationProperties {
    page: number;
    totalPages: number;
    pageSize: number;
    totalItems?: number;
    pageSizeOptions?: number[];
    sortBy: string;
    sortDirection: string;
}


