import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IBookSummary } from '../models/book-overiew-model';
import { IGetBooksPagedRequest } from '../models/paged-result.model';
import { IResultServerSide } from '../../core/model';



@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = environment.apiBaseUrl + '/books';

  constructor(private http: HttpClient) { }

  getBooks(request: IGetBooksPagedRequest): Observable<IResultServerSide<IBookSummary[]>> {
    return this.http.post<IResultServerSide<IBookSummary[]>>(this.baseUrl, request);
  }
}
