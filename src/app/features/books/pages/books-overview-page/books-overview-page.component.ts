import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColDef, GridReadyEvent, GridApi, SortChangedEvent, PaginationChangedEvent, ColumnState, SortDirection, AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

import { AuthorDropdownComponent } from '../../../authors/components/author-dropdown/author-dropdown.component';
import { BookService } from '../../services/book.service';
import { IAuthors, IBookSummary } from '../../models/book-overiew-model';
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

  books: IBookSummary[] = [];
  isLoadingBooks = false;
  booksErrorMessage: string | null = null;
  private paginationInitialized = false;

  private gridApi!: GridApi;
  private currentAuthorId: number | null = null;
  private lastSortModel: string | null = null;
  columnDefs: ColDef[] = [
    { field: 'Title', headerName: 'Title', sortable: true, filter: true },
    {
      field: 'Authors',
      headerName: 'Authors',
      valueGetter: params =>
        params.data.authors.map((a: IAuthors) => `${a.firstName} ${a.lastName}`).join(', '),
      flex: 2
    },
    { field: 'AuthorCount', headerName: 'Author Count', sortable: true, filter: 'agNumberColumnFilter' },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(private bookService: BookService) { }

  ngOnInit(): void { }

  onEventAuthorSelected(authorId: number | null): void {
    this.currentAuthorId = authorId;
    if (authorId !== null) {
      console.log('onEventAuthorSelected', authorId);
      this.loadBooksByAuthor(authorId);
    } else {
      this.books = [];
    }
  }

  private loadBooksByAuthor(authorId: number, page: number = 1, pageSize: number = 10, sortBy: string = 'Title', sortDirection: string = 'ASC') {
    this.isLoadingBooks = true;
    this.booksErrorMessage = null;
    this.bookService.getBooksPaged({
      authorId,
      page,
      pageSize,
      sortBy,
      sortDirection
    }).subscribe({
      next: (data: IBookSummary[]) => {
        this.books = data;
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
  //   if (
  //     this.gridApi &&
  //     this.gridApi.paginationGetCurrentPage !== undefined &&
  //     this.gridApi.paginationGetPageSize !== undefined &&
  //     this.currentAuthorId !== null
  //   ) {
  //     const currentPage = this.gridApi.paginationGetCurrentPage() + 1;
  //     const pageSize = this.gridApi.paginationGetPageSize();

  //     console.log('Pagination changed: page', currentPage, 'size', pageSize);

  //     this.loadBooksByAuthor(this.currentAuthorId, currentPage, pageSize);
  //   } else {
  //     console.warn('Pagination not ready or missing author id.');
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
