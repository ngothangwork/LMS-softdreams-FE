import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  let cloned = req;
  if (token) {
    cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(cloned).pipe(
    catchError((error) => {
      let errMsg: string | undefined;

      if (typeof error.error === 'string') {
        errMsg = error.error;
      } else if (error.error?.message) {
        errMsg = error.error.message;
      } else if (error.message) {
        errMsg = error.message;
      }

      if (
        error.status === 401 &&
        errMsg?.toLowerCase().includes('expired') &&
        !req.headers.has('x-refresh')
      ) {
        console.warn("Access token expired, trying refresh...");

        return authService.refreshToken().pipe(
          switchMap((res) => {
            if (res.success) {
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.result.token}`,
                  'x-refresh': 'true'
                }
              });
              return next(newReq);
            }
            authService.logout();
            return throwError(() => error);
          }),
          catchError(() => {
            console.error("Refresh token failed, logging out...");
            authService.logout();
            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
