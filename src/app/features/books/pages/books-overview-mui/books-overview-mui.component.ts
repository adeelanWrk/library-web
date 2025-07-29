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
import { IBookWithAuthorsMui } from '../../models/book-overiew-mui-model';

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
  displayedColumns: string[] = ['title', 'authors'];
  dataSource = new MatTableDataSource<IBookWithAuthorsMui | null>([]);


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
        this.dataSource.data = res.data ?? [];
        this.paginationProperties.totalItems = res.totalCount;
        this.paginationProperties.totalPages = res.totalPages;
        this.paginationProperties.page = res.page;
        this.paginationProperties.pageSize = res.pageSize;
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
}
