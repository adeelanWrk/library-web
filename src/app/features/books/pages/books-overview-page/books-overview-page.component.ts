import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ColDef,
  GridReadyEvent,
  GridApi,
  SortChangedEvent,
  PaginationChangedEvent,
  AllCommunityModule,
  ModuleRegistry
} from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

import { AuthorDropdownComponent } from '../../../authors/components/author-dropdown/author-dropdown.component';
import { BookService } from '../../services/book.service';
import { IAuthors, IBookSummary } from '../../models/book-overiew-model';
import { IResultServerSide } from '../../../core/model';
import { IGetBooksPagedRequest } from '../../models/paged-result.model';
import { PaginationComponent } from '../../../core/Pagination/pagination.component/pagination.component';
import { IPaginationProperties } from '../../../core/Pagination/model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TitleCellRendererComponent } from '../../components/ag-extension-components/title-cell-renderer.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-books-overview-page',
  templateUrl: './books-overview-page.component.html',
  styleUrls: ['./books-overview-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    AuthorDropdownComponent,
    PaginationComponent,
    MatProgressSpinnerModule
  ]
})
export class BooksOverviewPageComponent implements OnInit {


  books: IBookSummary[] = [];
  isLoading = false;
  booksErrorMessage: string | null = null;

  private gridApi!: GridApi;
  private currentAuthorId: number | null = null;
  private lastSortModel: string | null = null;
  public paginationProperties: IPaginationProperties = {
    page: 1,
    totalPages: 20,
    pageSize: 10,
    totalItems: 200,
    pageSizeOptions: [5, 10, 20, 50, 100],
    sortBy: 'title',
    sortDirection: 'ASC'
  };
  columnDefs: ColDef[] = [
    { field: 'row', headerName: 'Row', sortable: true, filter: false },
    {
      field: 'title',
      headerName: 'Title',
      sortable: true,
      filter: false,
      cellRenderer: TitleCellRendererComponent
    },
    {
      field: 'authors',
      headerName: 'Authors',
      valueGetter: params =>
        params.data.authors.map((a: IAuthors) => `${a.firstName} ${a.lastName}`).join(', '),
      flex: 2
    },
    { field: 'authorCount', headerName: 'Author Count', sortable: true, filter: false },
  ];


  defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true,
  };

  constructor(private bookService: BookService, private router: Router) { }

  ngOnInit(): void { }
  get requestParameters(): IGetBooksPagedRequest {
    return {
      authorId: this.currentAuthorId,
      page: this.paginationProperties.page,
      pageSize: this.paginationProperties.pageSize,
      sortBy: this.paginationProperties.sortBy,
      sortDirection: this.paginationProperties.sortDirection
    };
  }

  onEventAuthorSelected(authorId: number | null): void {
    this.currentAuthorId = authorId;
    if (authorId !== null) {
      const pageSize = this.gridApi?.paginationGetPageSize() || 10;
      this.gridApi?.paginationGoToFirstPage();
      this.loadData(authorId, 1, pageSize);
    } else {
      this.books = [];
    }
  }

  private loadData(
    authorId: number,
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'title',
    sortDirection: string = 'ASC'
  ) {
    this.isLoading = true;
    this.booksErrorMessage = null;

    this.bookService.getBooks({
      authorId,
      page,
      pageSize,
      sortBy,
      sortDirection
    }).subscribe({
      next: (res: IResultServerSide<IBookSummary[]>) => {
        this.books = res.data || [];
        this.paginationProperties.totalItems = res.totalCount || 0;
        this.paginationProperties.totalPages = res.totalPages || 0;
        this.paginationProperties.page = res.page || 1
        this.paginationProperties.pageSize = res.pageSize || 10;

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching books by author:', err);
        this.booksErrorMessage = 'ไม่สามารถดึงข้อมูลหนังสือสำหรับผู้แต่งที่เลือกได้';
        this.isLoading = false;
        this.books = [];
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }


  // onPaginationChanged(event: PaginationChangedEvent) {
  //   if (!this.paginationInitialized) {
  //     this.paginationInitialized = true;
  //     return;
  //   }

  //   if (this.gridApi && this.currentAuthorId !== null) {
  //     const currentPage = this.gridApi.paginationGetCurrentPage() + 1;
  //     const pageSize = this.gridApi.paginationGetPageSize();

  //     const sortModel = this.gridApi.getSortModel();
  //     const sortBy = sortModel[0]?.colId || 'Title';
  //     const sortDirection = (sortModel[0]?.sort || 'asc').toUpperCase();

  //     this.loadData(this.currentAuthorId, currentPage, pageSize, sortBy, sortDirection);
  //   }
  // }

  onSortChanged(event: any) {
    console.log('Sort changed event:', event);
    if (this.gridApi && this.currentAuthorId !== null) {
      // const columnState: ColumnState[] = event.columnApi.getColumnState();

      // const sortedColumns = columnState.filter((col: ColumnState) => col.sort);
      const eventColumns = event.columns;
      let sortBy = 'Title';
      let sortDirection = 'ASC';

      sortBy = eventColumns[0].colId;
      sortDirection = eventColumns[0].sort!.toUpperCase();
      this.paginationProperties.sortBy = sortBy;
      this.paginationProperties.sortDirection = sortDirection;

      const currentSort = `${sortBy}_${sortDirection}`;

      // console.log('Current sort:', currentSort);
      // console.log('Last sort model:', this.lastSortModel);
      // console.log('xxx', currentSort !== this.lastSortModel);

      if (currentSort !== this.lastSortModel) {
        this.lastSortModel = currentSort;
        this.loadData(
          this.currentAuthorId,
          1,
          this.gridApi.paginationGetPageSize(),
          sortBy,
          sortDirection
        );
      }
    }
  }


  onPageChanged(newPage: number) {
    this.paginationProperties.page = newPage;

    this.loadData(this.requestParameters.authorId!, this.paginationProperties.page,
      this.paginationProperties.pageSize, this.paginationProperties.sortBy, this.paginationProperties.sortDirection);
  }

  onPageSizeChanged(newSize: number) {
    this.paginationProperties.pageSize = newSize;
    this.paginationProperties.page = 1;
    this.loadData(this.requestParameters.authorId!, 1, newSize,
      this.paginationProperties.sortBy, this.paginationProperties.sortDirection);
  }
  redirectTo(bookId: any) {
    console.log('Redirecting to book details for bookId:', bookId);
    this.router.navigate(['/books', bookId]);
  }
}
