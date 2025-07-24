import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author } from '../models/author.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // getAuthors(term: string): Observable<Author[]> {
  //   return this.http.get<Author[]>(`${this.apiUrl}/authors?search=${term}`);
  // }
  searchAuthors(term: string): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.apiUrl}/authors/search?term=${term}`);
  }

}