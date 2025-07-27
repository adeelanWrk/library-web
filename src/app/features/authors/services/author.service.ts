import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAuthor } from '../models/author.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAuthors(): Observable<IAuthor[]> {
    return this.http.get<IAuthor[]>(`${this.apiUrl}/authors/raw`);
  }
  searchAuthors(term: string): Observable<IAuthor[]> {
    return this.http.get<IAuthor[]>(`${this.apiUrl}/authors/search?term=${term}`);
  }

}