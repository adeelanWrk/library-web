import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IBookSummary } from '../models/book-overiew-model';

export interface GetBooksPagedRequestDto {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: string;
  authorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = environment.apiBaseUrl + '/books';

  constructor(private http: HttpClient) { }

  getBooksPaged(request: GetBooksPagedRequestDto): Observable<IBookSummary[]> {
    return this.http.post<IBookSummary[]>(this.baseUrl, request);
  }

  getBooksByAuthorId(authorId: number): Observable<IBookSummary[]> {
    return this.getBooksPaged({
      authorId,
      page: 1,
      pageSize: 10,
      sortBy: 'Title',
      sortDirection: 'ASC'
    });
  }
}
