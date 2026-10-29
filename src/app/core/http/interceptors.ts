import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../notifications/notification.service';
import { LoadingService } from './loading.service';

/**
 * Registered in app.config.ts, in this order:
 *   request  →  auth → loading → error  →  server
 *   response ←  auth ← loading ← error  ←  server
 */

/** 1. Add the token to every request. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return token ? next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })) : next(req);
};

/** 2. Global "something is loading" indicator. */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));
};

/**
 * 3. Errors that every page handles the same way.
 * 400 and 404 are NOT handled here: the page decides (e.g. show field errors).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notify = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const isLogin = req.url.endsWith('/auth/login');
      if (err.status === 401 && !isLogin) {
        notify.error('Your session has expired. Please log in again.');
        auth.logout(router.url);
      } else if (err.status === 0) {
        notify.error('Cannot reach the server. Is "npm run api" running?');
      } else if (err.status >= 500) {
        notify.error('Something went wrong on the server. Please try again.');
      }
      return throwError(() => err); // always re-throw so the caller can react too
    }),
  );
};
