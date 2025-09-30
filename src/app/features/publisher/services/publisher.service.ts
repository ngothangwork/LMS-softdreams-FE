import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response';
import {PublisherCreate, PublisherResponse, PublisherUpdate, PublisherUpdateResponse} from '../models/publisher.model';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private url = 'http://localhost:8080/publishers';

  constructor(private http: HttpClient) {}

  getPublishers(): Observable<ApiResponse<PublisherResponse[]>> {
    return this.http.get<ApiResponse<PublisherResponse[]>>(this.url);
  }

  getPublisherById(id: number): Observable<ApiResponse<PublisherResponse>> {
    return this.http.get<ApiResponse<PublisherResponse>>(`${this.url}/${id}`);
  }

  getPublisherUpdate() : Observable<ApiResponse<PublisherUpdateResponse[]>> {
    return this.http.get<ApiResponse<PublisherUpdateResponse[]>>(`${this.url}/options`);
  }

  createPublisher(publisher: PublisherCreate): Observable<ApiResponse<PublisherResponse>> {
    return this.http.post<ApiResponse<PublisherResponse>>(this.url, publisher);
  }

  updatePublisher(id: number, publisher: PublisherUpdate): Observable<ApiResponse<PublisherResponse>> {
    return this.http.put<ApiResponse<PublisherResponse>>(`${this.url}/${id}`, publisher);
  }

  deletePublisher(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.url}/${id}`);
  }

  getPublisherByName(name: string): Observable<ApiResponse<PublisherResponse[]>> {
    return this.http.get<ApiResponse<PublisherResponse[]>>(`${this.url}/search?name=${name}`);
  }
}
