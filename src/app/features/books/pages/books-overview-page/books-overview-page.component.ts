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
import { IPaginationProperties } from '../../../core/ag-drid/pagination';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-books-overview-page',
  templateUrl: './books-overview-page.component.html',
  styleUrls: ['./books-overview-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    AuthorDropdownComponent
  ]
})
export class BooksOverviewPageComponent implements OnInit {
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [10, 20, 50, 100];


  books: IBookSummary[] = [];
  isLoadingBooks = false;
  booksErrorMessage: string | null = null;
  private paginationInitialized = false;
  

  private gridApi!: GridApi;
  private currentAuthorId: number | null = null;
  private lastSortModel: string | null = null;
  public paginationProperties: IPaginationProperties = {
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    sortBy: 'title',
    sortDirection: 'ASC'
  };
  columnDefs: ColDef[] = [
    { field: 'title', headerName: 'Title', sortable: true, filter: false },
    {
      field: 'authors',
      headerName: 'Authors',
      valueGetter: params =>
        params.data.authors.map((a: IAuthors) => `${a.firstName} ${a.lastName}`).join(', '),
      flex: 2
    },
    { field: 'authorCount', headerName: 'Author Count', sortable: true, filter: false },
  ];
    // { field: 'authorCount', headerName: 'Author Count', sortable: true, filter: 'agNumberColumnFilter' },


  defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true,
  };

  constructor(private bookService: BookService) { }

  ngOnInit(): void { }

  onEventAuthorSelected(authorId: number | null): void {
    console.log('Selected author ID:', authorId);
    this.currentAuthorId = authorId;
    if (authorId !== null) {
      const pageSize = this.gridApi?.paginationGetPageSize() || 10;
      this.gridApi?.paginationGoToFirstPage();
      this.loadBooksByAuthor(authorId, 1, pageSize);
    } else {
      this.books = [];
    }
  }

  private loadBooksByAuthor(
    authorId: number,
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'title',
    sortDirection: string = 'ASC'
  ) {
    this.isLoadingBooks = true;
    this.booksErrorMessage = null;

    this.bookService.getBooks({
      authorId,
      page,
      pageSize,
      sortBy,
      sortDirection
    }).subscribe({
      next: (data: IResultServerSide<IBookSummary[]>) => {
        this.books = data.data || [];
        this.paginationProperties.totalCount = data.totalCount || 0;
        this.isLoadingBooks = false;
      },
      error: (err: any) => {
        console.error('Error fetching books by author:', err);
        this.booksErrorMessage = 'ไม่สามารถดึงข้อมูลหนังสือสำหรับผู้แต่งที่เลือกได้';
        this.isLoadingBooks = false;
        this.books = [];
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }
  onPaginationChanged(event: PaginationChangedEvent) {
    if (!this.paginationInitialized) {
      this.paginationInitialized = true;
      return;
    }

    if (this.gridApi && this.currentAuthorId !== null && event.newPage && event.newPageSize) {
      const currentPage = this.gridApi.paginationGetCurrentPage() + 1;
      const pageSize = this.gridApi.paginationGetPageSize();
      this.loadBooksByAuthor(this.currentAuthorId, currentPage, pageSize);
    }
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

  //     this.loadBooksByAuthor(this.currentAuthorId, currentPage, pageSize, sortBy, sortDirection);
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
      const currentSort = `${sortBy}_${sortDirection}`;

      console.log('Current sort:', currentSort);
      console.log('Last sort model:', this.lastSortModel);
      console.log('xxx', currentSort !== this.lastSortModel);

      if (currentSort !== this.lastSortModel) {
        this.lastSortModel = currentSort;
        this.loadBooksByAuthor(
          this.currentAuthorId,
          1,
          this.gridApi.paginationGetPageSize(),
          sortBy,
          sortDirection
        );
      }
    }
  }
}
