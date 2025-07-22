import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // เพิ่มบรรทัดนี้
import { AgGridModule } from 'ag-grid-angular'; // เพิ่มบรรทัดนี้ (ตรวจสอบว่าไม่มี .forRoot() แล้ว)
import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';
import { AuthorDropdownComponent } from './features/authors/components/author-dropdown/author-dropdown.component';
import { BookListComponent } from './features/books/components/book-list/book-list.component';
import { BooksOverviewPageComponent } from './features/books/pages/books-overview-page/books-overview-page.component';
import { BookTableComponent } from './features/books/components/book-table/book-table.component';
import { BooksSummaryPageComponent } from './features/books/pages/books-summary-page/books-summary-page.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    AgGridModule , 
    AuthorDropdownComponent,
    BookListComponent,
    BooksOverviewPageComponent,
    BookTableComponent,
    BooksSummaryPageComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }