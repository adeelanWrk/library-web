import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ColDef,
  GridReadyEvent,
  GridApi,
  PaginationChangedEvent,
  SortChangedEvent,
  AllCommunityModule,
  ModuleRegistry
} from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

import { AuthorDropdownComponent } from '../../../authors/components/author-dropdown/author-dropdown.component';
import { BookService } from '../../services/book.service';
import { IAuthors, IBookSummary } from '../../models/book-overiew-model';
import { IRequestServerSide, IResultServerSide } from '../../../core/model';
import { IPaginationProperties } from '../../../core/ag-drid/pagination';
import { IGetBooksPagedRequest } from '../../models/paged-result.model';

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

  public paginationProperties: IPaginationProperties = {
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    sortBy: 'title',
    sortDirection: 'ASC'
  };

  columnDefs: ColDef[] = [
    { field: 'title', headerName: 'Title', sortable: true },
    {
      field: 'authors',
      headerName: 'Authors',
      valueGetter: params =>
        params.data.authors.map((a: IAuthors) => `${a.firstName} ${a.lastName}`).join(', '),
      flex: 2
    },
    { field: 'authorCount', headerName: 'Author Count', sortable: true },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true,
  };

  constructor(private bookService: BookService) { }

  ngOnInit(): void { }

  onEventAuthorSelected(authorId: number | null): void {
    this.currentAuthorId = authorId;
    if (authorId !== null && this.gridApi) {
      this.gridApi.paginationGoToFirstPage();
      this.loadBooksFromGrid();
    } else {
      this.books = [];
    }
  }



  private loadBooksFromGrid(): void {
    if (!this.gridApi || this.currentAuthorId === null) return;

    const currentPage = this.gridApi.paginationGetCurrentPage() + 1;
    const pageSize = this.gridApi.paginationGetPageSize();

    // const sortModel = this.gridApi.getSortModel();
    // const sortBy = sortModel[0]?.colId || 'title';
    // const sortDirection = (sortModel[0]?.sort || 'asc').toUpperCase();

    this.loadBooksByAuthor(this.currentAuthorId, currentPage, pageSize);//sortBy, sortDirection
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

    const request: IGetBooksPagedRequest = {
      authorId,
      page,
      pageSize,
      sortBy,
      sortDirection
    };

    this.bookService.getBooks(request).subscribe({
      next: (data: IResultServerSide<IBookSummary[]>) => {
        if (!data.isError && data.data) {
          this.books = data.data;
          this.paginationProperties.totalCount = data.totalCount;
          this.paginationProperties.totalPages = data.totalPages;
        } else {
          this.booksErrorMessage = data.errorMessage || 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
          this.books = [];
        }
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

  onPaginationChanged(_: PaginationChangedEvent) {
    console.log('Pagination changed',_);
    if (!this.paginationInitialized) {
      this.paginationInitialized = true;
      return;
    }
    
    if (this.gridApi && this.currentAuthorId !== null) {
      this.loadBooksFromGrid();
    }
  }

  // onSortChanged(_: SortChangedEvent) {
  //   if (this.gridApi && this.currentAuthorId !== null) {
  //     this.loadBooksFromGrid();
  //   }
  // }
  onSortChanged(event: any) {
     const eventColumns = event.columns;
      let sortBy = 'Title';
      let sortDirection = 'ASC';

      sortBy = eventColumns[0].colId;
      sortDirection = eventColumns[0].sort!.toUpperCase();
      const currentSort = `${sortBy}_${sortDirection}`;

      console.log('Current sort:', currentSort);
      console.log('Last sort model:', this.lastSortModel);
      console.log('xxx', currentSort !== this.lastSortModel);
    if (this.currentAuthorId !== null && currentSort !== this.lastSortModel) {
      this.lastSortModel = currentSort;
      this.loadBooksByAuthor(this.currentAuthorId, 1, this.gridApi.paginationGetPageSize(), sortBy, sortDirection);
    }
  }
}
