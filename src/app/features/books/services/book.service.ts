import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IBookSummary } from '../models/book-overiew-model';
import { IGetBooksPagedRequest } from '../models/paged-result.model';
import { IResultServerSide } from '../../core/model';
import { IBooksQueryParams, IBooksResponse } from '../models/book-grid-model';
import { IBookWithAuthorsMui } from '../models/book-overiew-mui-model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = environment.apiBaseUrl + '/books';

  constructor(private http: HttpClient) { }

  exportRawData(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export-raw-data`, {
      responseType: 'blob',
    });
  }
  // importRawData(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   return this.http.post(`${this.baseUrl}/import-raw-data`, formData);
  // }
  importRawData(file: File): Observable<any> {
  return new Observable(observer => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.http.post(`${this.baseUrl}/import-raw-data`, { fileBase64: base64String, fileName: file.name })
        .subscribe({
          next: data => {
            observer.next(data);
            observer.complete();
          },
          error: err => observer.error(err)
        });
    };
    reader.onerror = err => observer.error(err);
    reader.readAsDataURL(file);
  });
}



  getBooksMui(request: IGetBooksPagedRequest): Observable<IResultServerSide<IBookWithAuthorsMui[]>> {
    return this.http.post<IResultServerSide<IBookWithAuthorsMui[]>>(this.baseUrl + '/mui', request);
  }


  getBooks(request: IGetBooksPagedRequest): Observable<IResultServerSide<IBookSummary[]>> {
    return this.http.post<IResultServerSide<IBookSummary[]>>(this.baseUrl, request);
  }

  fetchBooks(params: IBooksQueryParams): Observable<IBooksResponse> {
    let httpParams = new HttpParams()
      .set('startRow', params.startRow.toString())
      .set('endRow', params.endRow.toString());

    if (params.sortModel && params.sortModel.length > 0) {
      httpParams = httpParams.set('sortModel', JSON.stringify(params.sortModel));
    }
    if (params.filterModel) {
      httpParams = httpParams.set('filterModel', JSON.stringify(params.filterModel));
    }
    if (params.quickFilter && params.quickFilter.trim() !== '') {
      httpParams = httpParams.set('quickFilter', params.quickFilter.trim());
    }

    return this.http.get<IBooksResponse>(this.baseUrl + '/infinite', { params: httpParams });
  }
}
