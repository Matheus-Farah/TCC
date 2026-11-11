import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const API_URL = 'http://localhost:8000';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.token();
  const ehNossaAPI = req.url.startsWith(API_URL);

  const requisicao =
    token && ehNossaAPI
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(requisicao).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401 && ehNossaAPI && !req.url.includes('/auth/')) {
        auth.logout();
        router.navigate(['/login', { replaceUrl: true }]);
      }
      return throwError(() => erro);
    }),
  );
};
