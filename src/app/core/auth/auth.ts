import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, tap, throwError} from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { UserLoginResponse } from '../../features/auth/pages/login-page/models/user-login-response';
import {Router} from '@angular/router';
import {RegisterRequest} from '../../features/auth/pages/register-pages/model/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:8080/auth';
  private readonly tokenKey = 'access_token';
  private readonly userKey = 'user';
  private userSubject = new BehaviorSubject<any>(this.getUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<ApiResponse<UserLoginResponse>> {
    return this.http.post<ApiResponse<UserLoginResponse>>(`${this.API_URL}/login`, { username, password })
      .pipe(
        tap((res) => {
          if (res.success) {
            localStorage.setItem(this.tokenKey, res.result.token);
            localStorage.setItem('refresh_token', res.result.refreshToken);
            localStorage.setItem(this.userKey, JSON.stringify(res.result));
            this.userSubject.next(res.result);
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
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      this.http.post(`${this.API_URL}/logout`, { refreshToken }).subscribe({
        next: () => {
          this.clearLocalStorageAndRedirect();
        },
        error: () => {
          this.clearLocalStorageAndRedirect();
        }
      });
    } else {
      this.clearLocalStorageAndRedirect();
    }
  }
  private clearLocalStorageAndRedirect(): void {
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

  getRole(): string | null {
    return this.getUser()?.userRole?.toUpperCase() || null;
  }

  register(registerData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, registerData);
  }


  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.getRole()!);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}
