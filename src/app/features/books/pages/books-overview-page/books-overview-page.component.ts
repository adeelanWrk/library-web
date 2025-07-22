import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef, GridReadyEvent, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
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


  columnDefs: ColDef[] = [
    { field: 'title', headerName: 'Title', sortable: true, filter: true },
    { field: 'authorCount', headerName: 'Author Count', sortable: true, filter: 'agNumberColumnFilter' },
    {
      headerName: 'Authors',
      valueGetter: params =>
        params.data.authors.map((a: IAuthors) => `${a.firstName} ${a.lastName}`).join(', '),
      flex: 2
    }
  ];


  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
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
    console.log('Grid ready, row count:', params.api.getDisplayedRowCount());
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
