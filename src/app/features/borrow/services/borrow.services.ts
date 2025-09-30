import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BorrowCreateRequest, BorrowResponse, BorrowUpdateRequest} from '../models/borrow.models';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root'
})

export class BorrowService {

  private API_URL = 'http://localhost:8080/borrows';

  constructor(private http: HttpClient) {
  }

  createBorrow(borrow: BorrowCreateRequest): Observable<ApiResponse<BorrowResponse>> {
    return this.http.post<ApiResponse<BorrowResponse>>(this.API_URL, borrow);
  }

  getBorrowById(id: number): Observable<ApiResponse<BorrowResponse>> {
    return this.http.get<ApiResponse<BorrowResponse>>(`${this.API_URL}/${id}`);
  }

  getAllBorrows(): Observable<ApiResponse<BorrowResponse[]>> {
    return this.http.get<ApiResponse<BorrowResponse[]>>(this.API_URL);
  }

  exportBorrows(format: string = 'pdf'): Observable<Blob> {
    return this.http.get(`${this.API_URL}/export?format=${format}`, {
      responseType: 'blob'
    });
  }

  updateBorrow(id: number, borrow: BorrowUpdateRequest): Observable<ApiResponse<BorrowResponse>> {
    return this.http.put<ApiResponse<BorrowResponse>>(`${this.API_URL}/${id}`, borrow);
  }

}
