import { Component, Input } from '@angular/core';
import { BookSummary } from '../../models/book-summary.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  @Input() books: BookSummary[] | null = null; // รับข้อมูลหนังสือเข้ามา

  constructor() { }
}