import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/paged-result.model';
import { BookSummary } from '../models/book-summary.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'https://localhost:7001/api/books'; // <--- เปลี่ยนเป็น URL จริงของ Backend

  constructor(private http: HttpClient) { }

  getBooksPaged(
    page: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string
  ): Observable<PagedResult<BookSummary>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<PagedResult<BookSummary>>(this.apiUrl, { params });
  }
}