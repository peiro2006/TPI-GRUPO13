import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const isAuthRequest = req.url.includes('/api/auth/');
  const token = auth.getToken();

  if (!isAuthRequest && token && auth.isTokenExpired(token)) {
    auth.logout();
    router.navigate(['/login']);

    return throwError(() => new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      url: req.url,
      error: { error: 'Sesión expirada. Iniciá sesión nuevamente.' }
    }));
  }

  const authenticatedRequest = !isAuthRequest && token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (!isAuthRequest && error instanceof HttpErrorResponse && error.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
