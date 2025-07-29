import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGetBooksPagedRequest } from '../../models/paged-result.model';
import { IPaginationProperties } from '../../../core/Pagination/model';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';
import { IBookWithAuthorsMui, IBookWithAuthorsMuiFlat } from '../../models/book-overiew-mui-model';

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
    HttpClientModule
  ],
})
export class BooksOverviewMuiComponent implements OnInit {
  // headerColumns: string[] = ['title', 'authorName'];
  // displayedColumns: string[] = ['title', 'authorName'];

  headerColumns: string[] = ['title', 'publisher', 'price', 'authorName'];
  displayedColumns: string[] = ['title', 'publisher', 'price', 'authorName'];
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
  };
  currentAuthorId: number | null = 1994;
  constructor(private bookService: BookService, private router: Router) {
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

  loadData() {
    this.bookService.getBooksMui(this.requestParameters).subscribe({
      next: (res) => {
        console.log('Books loaded:', res.data);
        const processedData: IBookWithAuthorsMuiFlat[] = [];

        res.data?.forEach(book => {
          book.authors?.forEach((author, index) => {
            if (author != null) {
              processedData.push({
                bookId: book.bookId,
                title: book.title,
                publisher: book.publisher,
                price: book.price,
                authorId: author.authorId,
                authorName: `${author.firstName} ${author.lastName}`,
                authorCount: book.authorCount
              });
            }
          });
        });

        this.dataSource.data = processedData;
        this.paginationProperties.totalItems = res.totalCount ?? 0;
        this.paginationProperties.totalPages = res.totalPages ?? 0;
        this.paginationProperties.page = res.page ?? 1;
        this.paginationProperties.pageSize = res.pageSize ?? this.paginationProperties.pageSize;
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
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
    if (field === 'title' || field === 'publisher' || field === 'price') {
      if (index === 0 && this.dataSource.data[0]) return this.dataSource.data[0].authorCount;
      if (
        this.dataSource.data[index] != null &&
        this.dataSource.data[index - 1] != null &&
        this.dataSource.data[index].bookId !== this.dataSource.data[index - 1]!.bookId
      ) {
        return this.dataSource.data[index]!.authorCount;
      }
      return null;
    }
    return null;
  }
}
