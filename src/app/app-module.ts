import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // เพิ่มบรรทัดนี้
import { AgGridModule } from 'ag-grid-angular'; // เพิ่มบรรทัดนี้ (ตรวจสอบว่าไม่มี .forRoot() แล้ว)
import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';
import { AuthorDropdown } from './features/authors/components/author-dropdown/author-dropdown.component';
import { BookList } from './features/books/components/book-list/book-list.component';
import { BooksOverviewPage } from './features/books/pages/books-overview-page/books-overview-page.component';
import { BookTable } from './features/books/components/book-table/book-table.component';
import { BooksSummaryPage } from './features/books/pages/books-summary-page/books-summary-page.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthorDropdown,
    BookList,
    BooksOverviewPage,
    BookTable,
    BooksSummaryPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    AgGridModule     
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }