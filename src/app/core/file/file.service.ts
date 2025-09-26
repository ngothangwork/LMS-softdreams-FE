import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApiResponse} from '../models/api-response';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  private API_URL = 'http://localhost:8080/files';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<string>>(`${this.API_URL}/upload`, formData);
  }
}
