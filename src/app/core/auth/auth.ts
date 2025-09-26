import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { UserLoginResponse } from '../../features/auth/pages/login-page/models/user-login-response';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:8080/auth';
  private readonly tokenKey = 'access_token';
  private readonly userKey = 'user';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<ApiResponse<UserLoginResponse>> {
    return this.http.post<ApiResponse<UserLoginResponse>>(`${this.API_URL}/login`, { username, password })
      .pipe(
        tap((res) => {
          if (res.success) {
            localStorage.setItem(this.tokenKey, res.result.token);
            localStorage.setItem('refresh_token', res.result.refreshToken);
            localStorage.setItem(this.userKey, JSON.stringify(res.result));
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): UserLoginResponse | null {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<ApiResponse<UserLoginResponse>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token found'));
    }
    return this.http.post<ApiResponse<UserLoginResponse>>(
      `${this.API_URL}/refresh`,
      { refreshToken }
    ).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem('access_token', res.result.token);
          localStorage.setItem('refresh_token', res.result.refreshToken);
        }
      })
    );
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }



}
