import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBookSummary } from '../../models/book-overiew-model';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  @Input() books: IBookSummary[] | null = null;
  @Input() isLoading: boolean = false; 
  @Input() errorMessage: string | null = null; 

  constructor() { }
}