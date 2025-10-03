import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BookResponse,
  BookCreate,
  BookUpdate,
  BookSearch,
  BookDetailResponse,
  BookUpdateResponse, BookDetailResponseDTO
} from '../models/book.model';
import {ApiResponse, Page} from '../../../core/models/api-response';
import {BorrowSearch} from '../../borrow/models/borrow.models';


@Injectable({
  providedIn: 'root'
})
export class BookService {
  private API_URL = 'http://localhost:8080/books';

  constructor(private http: HttpClient) {}

  searchBooks(
    payload: BookSearch,
    page: number = 0,
    size: number = 5,
    sort: string = 'name,asc'
  ): Observable<ApiResponse<Page<BookResponse>>> {
    return this.http.post<ApiResponse<Page<BookResponse>>>(
      `${this.API_URL}/search?page=${page}&size=${size}&sort=${sort}`,
      payload
    );
  }

  getBook(id: number): Observable<ApiResponse<BookDetailResponseDTO>> {
    return this.http.get<ApiResponse<BookDetailResponseDTO>>(`${this.API_URL}/${id}`);
  }

  getBookUpdate(id: number): Observable<ApiResponse<BookUpdateResponse>> {
    return this.http.get<ApiResponse<BookUpdateResponse>>(`${this.API_URL}/update/${id}`);
  }

  createBook(book: BookCreate): Observable<ApiResponse<BookResponse>> {
    return this.http.post<ApiResponse<BookResponse>>(this.API_URL, book);
  }


  deleteBook(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.API_URL}/${id}`);
  }


  patchBook(id: number, book: Partial<BookUpdate>) {
    return this.http.patch<ApiResponse<BookResponse>>(`${this.API_URL}/${id}`, book);
  }

  exportPdf(
    payload: BookSearch,
    page: number = 0,
    size: number = 5,
    sort: string = 'name,asc'
  ): Observable<Blob> {
    return this.http.post(`${this.API_URL}/report/export?page=${page}&size=${size}&sort=${sort}`,
      payload,
      { responseType: 'blob' }
    );
  }

  exportExcel(
    payload: BookSearch,
    page: number = 0,
    size: number = 5,
    sort: string = 'name,asc'
  ): Observable<Blob> {
    return this.http.post(`${this.API_URL}/report/export-excel?page=${page}&size=${size}&sort=${sort}`,
      payload,
      { responseType: 'blob' }
    );
  }
}
