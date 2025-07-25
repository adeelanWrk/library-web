import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthorService } from '../../services/author.service';
import { IAuthor } from '../../models/author.model';
import { Subject, Observable, merge, of } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-author-dropdown',
  templateUrl: './author-dropdown.component.html',
  styleUrls: ['./author-dropdown.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
})
export class AuthorDropdownComponent implements OnInit {
  searchInput$ = new Subject<string>();
  authors$!: Observable<IAuthor[]>;
  selectedAuthorId: number | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  selectedAuthor: IAuthor | null = null;

  @Output() authorSelected = new EventEmitter<number | null>();

  constructor(private authorService: AuthorService) { }

  ngOnInit(): void {
    this.authors$ = merge(
      of(''),
      this.searchInput$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(term => term?.length >= 3)
      )
    ).pipe(
      switchMap(term => this.authorService.searchAuthors(term?.trim())),
    );
  }


onSelectionChange(author: IAuthor | null): void {
  this.selectedAuthorId = author?.authorId ?? null;
  console.log('Selected Author ID:', this.selectedAuthorId);
  this.authorSelected.emit(this.selectedAuthorId);
}
}
