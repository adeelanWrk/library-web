import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BookTableComponent } from '../../components/book-table/book-table.component';

@Component({
  selector: 'app-books-summary-page',
  templateUrl: './books-summary-page.component.html',
  styleUrls: ['./books-summary-page.component.css'],
  imports: [CommonModule, BookTableComponent],
})
export class BooksSummaryPageComponent {

  constructor() { }

}