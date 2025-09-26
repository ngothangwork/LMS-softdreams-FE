import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BookCopyCreate, BookCopyResponse, BookCopyUpdate} from '../models/bookcopy.model';
import {ApiResponse} from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class BookCopyService {
  private API_URL = 'http://localhost:8080/book-copies';

  constructor(private http: HttpClient) {}

  getAllBookCopies(): Observable<ApiResponse<BookCopyResponse[]>> {
    return this.http.get<ApiResponse<BookCopyResponse[]>>(this.API_URL);
  }

  getBookCopyById(id: number): Observable<ApiResponse<BookCopyResponse[]>> {
    return this.http.get<ApiResponse<BookCopyResponse[]>>(`${this.API_URL}/${id}`);
  }

  createBookCopy(payload: BookCopyCreate): Observable<ApiResponse<BookCopyResponse[]>> {
    return this.http.post<ApiResponse<BookCopyResponse[]>>(this.API_URL, payload);
  }

  updateBookCopy(
    id: number,
    payload: BookCopyUpdate
  ): Observable<ApiResponse<BookCopyResponse[]>> {
    return this.http.put<ApiResponse<BookCopyResponse[]>>(`${this.API_URL}/${id}`, payload);
  }

  deleteBookCopy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
