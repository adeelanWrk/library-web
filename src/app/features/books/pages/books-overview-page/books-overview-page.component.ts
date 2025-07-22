import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { IAuthors, IBookSummary } from '../../models/book-overiew-model';
import { AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { AuthorDropdownComponent } from '../../../authors/components/author-dropdown/author-dropdown.component';

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

  columnDefs: ColDef[] = [
    { field: 'title', headerName: 'Title', sortable: true, filter: true, flex: 1 },
    { field: 'publisher', headerName: 'Publisher', sortable: true, filter: true, flex: 1 },
    { field: 'price', headerName: 'Price', sortable: true, filter: 'agNumberColumnFilter', flex: 1 },
    { field: 'authorCount', headerName: 'Number of Authors', sortable: true, filter: 'agNumberColumnFilter', flex: 1 },
    {
      headerName: 'Authors',
      valueGetter: (params) =>
        (params.data.authors as IAuthors[]).map((a: IAuthors) => `${a.firstName} ${a.lastName}`).join(', '),
      flex: 2
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
  };

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    // เริ่มต้นไม่มีข้อมูลจนกว่าจะเลือกผู้แต่ง
  }

  onAuthorSelected(authorId: number | null): void {
    if (authorId !== null) {
      this.isLoadingBooks = true;
      this.booksErrorMessage = null;
      this.bookService.getBooksByAuthorId(authorId).subscribe({
        next: (data) => {
          this.books = data;
          this.isLoadingBooks = false;
        },
        error: (err) => {
          console.error('Error fetching books by author:', err);
          this.booksErrorMessage = 'ไม่สามารถดึงข้อมูลหนังสือสำหรับผู้แต่งที่เลือกได้';
          this.isLoadingBooks = false;
          this.books = [];
        }
      });
    } else {
      this.books = [];
    }
  }

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }
  onEventAuthorSelected(authorId: number | null): void {
    if (authorId !== null) {
      this.isLoadingBooks = true;
      this.booksErrorMessage = null;
      this.bookService.getBooksByAuthorId(authorId).subscribe({
        next: (data) => {
          this.books = data;
          this.isLoadingBooks = false;
        },
        error: (err) => {
          console.error('Error fetching books by author:', err);
          this.booksErrorMessage = 'ไม่สามารถดึงข้อมูลหนังสือสำหรับผู้แต่งที่เลือกได้';
          this.isLoadingBooks = false;
          this.books = [];
        }
      });
    } else {
      this.books = [];
    }
  }


}
