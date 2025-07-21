import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author.model';

@Component({
  selector: 'app-author-dropdown',
  templateUrl: './author-dropdown.component.html',
  styleUrls: ['./author-dropdown.component.css']
})
export class AuthorDropdownComponent implements OnInit {
  authors: Author[] = [];
  selectedAuthorId: number | null = null;

  @Output() authorSelected = new EventEmitter<number | null>();

  constructor(private authorService: AuthorService) { }

  ngOnInit(): void {
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data;
        // Optionally, set a default selected author or emit null
        this.selectedAuthorId = null; // เริ่มต้นที่ "เลือกผู้แต่ง"
      },
      error: (err) => {
        console.error('Error fetching authors', err);
        // Handle error, e.g., show a message to the user
      }
    });
  }

  onSelectionChange(): void {
    this.authorSelected.emit(this.selectedAuthorId);
  }
}