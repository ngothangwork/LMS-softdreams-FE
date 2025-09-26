import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../../../core/models/api-response';
import {Observable} from 'rxjs';
import {CategoryResponse} from '../models/category.model';
import {CategoryCreate} from '../models/category-create.model';
import {CategoryUpdate} from '../models/category-update.model';

@Injectable({
  providedIn: 'root'
})


export class CategoryService {
  private url = 'http://localhost:8080/categories';

  constructor(private http: HttpClient) {

  }

  getCategory(): Observable<ApiResponse<CategoryResponse[]>> {
    return this.http.get<ApiResponse<CategoryResponse[]>>(this.url);
  }

  getByCategoryId(id: number): Observable<ApiResponse<CategoryResponse>> {
    return this.http.get<ApiResponse<CategoryResponse>>(`${this.url}/${id}`);
  }

  getByCategoryName(name: string): Observable<ApiResponse<CategoryResponse[]>> {
    return this.http.get<ApiResponse<CategoryResponse[]>>(`${this.url}/name/${name}`);
  }

  createCategory(category: CategoryCreate): Observable<ApiResponse<CategoryResponse>> {
    return this.http.post<ApiResponse<CategoryResponse>>(this.url, category);
  }

  deleteCategory(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.url}/${id}`);
  }

  updateCategory(id: number, category: CategoryUpdate): Observable<ApiResponse<CategoryResponse>> {
    return this.http.put<ApiResponse<CategoryResponse>>(`${this.url}/${id}`, category);
  }
}
