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
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { TextToTableDialogComponent } from '../../components/text-to-table/text-to-table-dialog/text-to-table-dialog';
import { HistoryTrackComponent } from '../../components/history-track/history-track';

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
    MatProgressSpinnerModule,
    TextToTableDialogComponent,
    HistoryTrackComponent
  ],
})
export class BooksOverviewMuiComponent implements OnInit {

  private readonly rowSpanFields = ['history','title', 'publisher', 'price', 'authorCount'];

  readonly headerColumns: string[] = ['history','title', 'publisher', 'price', 'authorCount', 'authorName'];
  readonly displayedColumns: string[] = ['history','title', 'publisher', 'price', 'authorCount', 'authorName'];
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
  currentAuthorId: number | null = 1;
  isLoading: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private bookService: BookService,
    private router: Router,
    private sw: AlertService,
    private dialog: MatDialog
  ) {
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
  exportRawData() {
    this.isLoading = true;
    this.bookService.exportRawData().subscribe({
      next: (blob) => {
        const now = new Date();
        const dateStr = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
        saveAs(blob, `rawData_${dateStr}.xlsx`);
        this.sw.success('Raw data exported successfully!');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Export failed:', err);
        this.isLoading = false;
      }
    });
  }
  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.sw.error('Only Excel files (.xlsx, .xls) are allowed.');
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
      const confirmed = await this.sw.confirm('Are you sure you want to import this file?');
      if (confirmed) {
        this.isLoading = true;
        this.importRawData();
      } else {
        this.selectedFile = null;
        this.sw.info('Import cancelled.');
      }
    }
  }
  importRawData() {
    if (!this.selectedFile) {
      this.sw.error('Please select an Excel file before importing.');
      return;
    }

    this.bookService.importRawData(this.selectedFile).subscribe({
      next: (res) => {
        this.sw.success(res?.desc ?? 'Import successful!');
        this.selectedFile = null;
        this.loadData();
      },
      error: (err) => {
        this.sw.error('Import failed: ' + (err.error ?? 'Unknown error'));
        this.isLoading = false;

      }
    });
  }
  showModel(): void {
    const dialogRef = this.dialog.open(TextToTableDialogComponent, {
      width: '900px',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
      this.loadData();
      }
    });
  }
  
   openHistoryTrackDialog(element: IBookWithAuthorsMuiFlat): void {
    const dialogRef = this.dialog.open(HistoryTrackComponent, {
      width: '1000px',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // if (result === true) {
      // this.loadData();
      // }
    });
  }
  
  onEventAuthorSelected(authorId: number | null): void {
    this.currentAuthorId = authorId;
    if (authorId !== null) {
      this.currentAuthorId = authorId;
      this.loadData();
    } else {
    }
  }

  
  
} 
