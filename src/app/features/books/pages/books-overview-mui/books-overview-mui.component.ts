import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { IGetBooksPagedRequest } from '../../models/paged-result.model';
import { IPaginationProperties } from '../../../core/Pagination/model';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';
import { IBookWithAuthorsMui, IBookWithAuthorsMuiFlat } from '../../models/book-overiew-mui-model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertService } from '../../../core/alert/alert.service';

@Component({
  selector: 'books-overview-mui',
  templateUrl: './books-overview-mui.component.html',
  styleUrls: ['./books-overview-mui.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
})
export class BooksOverviewMuiComponent implements OnInit {
  
  private readonly rowSpanFields = ['title', 'publisher', 'price', 'authorCount'];
  
  readonly headerColumns: string[] = ['title', 'publisher', 'price', 'authorCount', 'authorName'];
  readonly displayedColumns: string[] = ['title', 'publisher', 'price', 'authorCount', 'authorName'];
  dataSource = new MatTableDataSource<IBookWithAuthorsMuiFlat | null>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public paginationProperties: IPaginationProperties = {
    page: 1,
    totalPages: 20,
    pageSize: 10,
    totalItems: 200,
    pageSizeOptions: [5, 10, 20, 50, 100],
    sortBy: 'title',
    sortDirection: 'ASC'
  }!;
  currentAuthorId: number | null = 1994;
  isLoading: boolean = false;
  constructor(
    private bookService: BookService,
    private router: Router,
    private sw: AlertService) {
    this.loadData();
  }

  ngOnInit(): void {
  }
  get requestParameters(): IGetBooksPagedRequest {
    return {
      authorId: this.currentAuthorId,
      page: this.paginationProperties.page,
      pageSize: this.paginationProperties.pageSize,
      sortBy: this.paginationProperties.sortBy,
      sortDirection: this.paginationProperties.sortDirection
    };
  }

  loadData(): void {
    this.isLoading = true;

    this.bookService.getBooksMui(this.requestParameters).pipe(
      // tap(() => this.sw.success('Books loaded successfully!')),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => this.handleSuccessfulResponse(response),
      error: (error) => {
        this.handleError(error);
        this.sw.error('Failed to load books');
      }
    });
  }

  private handleSuccessfulResponse(response: any): void {
    const books = response.data ?? [];
    const flattenedData = this.flattenBooksWithAuthors(books);
    this.dataSource.data = flattenedData;
    this.setPaginationProperties(response);
  }

  private flattenBooksWithAuthors(books: IBookWithAuthorsMui[]): IBookWithAuthorsMuiFlat[] {
    return books.flatMap(book =>
      (book.authors ?? []).filter(author => author != null).map(author => ({
        bookId: book.bookId,
        title: book.title,
        publisher: book.publisher,
        price: book.price,
        authorId: author.authorId,
        authorName: `${author.firstName} ${author.lastName}`,
        authorCount: book.authorCount
      }))
    );
  }

  private setPaginationProperties(response: any): void {
    this.paginationProperties.totalItems = response.totalCount ?? 0;
    this.paginationProperties.totalPages = response.totalPages ?? 0;
    this.paginationProperties.page = response.page ?? 1;
    this.paginationProperties.pageSize = response.pageSize ?? this.paginationProperties.pageSize;
  }

  private handleError(error: any): void {
    console.error('Error loading books:', error);
  }
  onPageChange(event: PageEvent) {
    this.paginationProperties.page = event.pageIndex + 1;
    this.paginationProperties.pageSize = event.pageSize;
    this.loadData();
  }

  onSortChange(event: Sort) {
    this.paginationProperties.sortBy = event.active;
    this.paginationProperties.sortDirection = event.direction;
    this.loadData();
  }
  getRowSpan(field: string, index: number): number | null {
    if (!this.rowSpanFields.includes(field)) {
      return null;
    }

    const row = this.dataSource.data[index];
    const prevRow = this.dataSource.data[index - 1];

    if (!row) return null;

    if (index === 0 || !prevRow || row.bookId !== prevRow.bookId) {
      return row.authorCount;
    }

    return null;
  }
}
