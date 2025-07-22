import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-author-dropdown',
  templateUrl: './author-dropdown.component.html',
  styleUrls: ['./author-dropdown.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AuthorDropdownComponent implements OnInit {
  authors: Author[] = [];
  selectedAuthorId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  @Output() authorSelected = new EventEmitter<number | null>();

  constructor(private authorService: AuthorService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data;
        this.selectedAuthorId = null; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching authors', err);
        this.errorMessage = 'ไม่สามารถดึงรายชื่อผู้แต่งได้';
        this.isLoading = false;
      }
    });
  }

  onSelectionChange(): void {
    this.authorSelected.emit(this.selectedAuthorId);
  }
}