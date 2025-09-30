import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthorResponse, AuthorUpdateResponse} from '../models/author.model';
import {ApiResponse, Page} from '../../../core/models/api-response';
import {AuthorCreate} from '../models/author-create.model';
import {AuthorUpdate} from '../models/author-update.model';

@Injectable({
  providedIn: 'root'
})

export class AuthorService {
  private url = 'http://localhost:8080/authors';

  constructor(private http: HttpClient) {
  }

  searchAuthors(
    name: string,
    page: number = 0,
    size: number = 5,
    sort: string = 'name,asc'
  ): Observable<ApiResponse<Page<AuthorResponse>>> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<ApiResponse<Page<AuthorResponse>>>(`${this.url}/search`, { params });
  }



  getAuthors(): Observable<ApiResponse<AuthorResponse[]>> {
    return this.http.get<ApiResponse<AuthorResponse[]>>(this.url);
  }

  getAuthor(id: number): Observable<ApiResponse<AuthorResponse>> {
    return this.http.get<ApiResponse<AuthorResponse>>(`${this.url}/${id}`);
  }

  getAuthorUpdates(): Observable<ApiResponse<AuthorUpdateResponse[]>> {
    return this.http.get<ApiResponse<AuthorUpdateResponse[]>>(`${this.url}/options`);
  }

  createAuthor(author: AuthorCreate): Observable<ApiResponse<AuthorResponse>> {
    return this.http.post<ApiResponse<AuthorResponse>>(this.url, author);
  }

  updateAuthor(id: number, author: AuthorUpdate): Observable<ApiResponse<AuthorResponse>> {
    return this.http.patch<ApiResponse<AuthorResponse>>(`${this.url}/${id}`, author);
  }

  deleteAuthor(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.url}/${id}`);
  }



}
