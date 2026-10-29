import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../notifications/notification.service';

/**
 * Last safety net for errors nobody caught (bugs in components, thrown errors).
 * HTTP errors are already handled by errorInterceptor, so they are skipped here.
 * In a real app, send the error to a logging service (Sentry, App Insights...) here.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private notify = inject(NotificationService);

  handleError(error: unknown) {
    if (error instanceof HttpErrorResponse) return;
    console.error('Unhandled error:', error);
    this.notify.error('Unexpected error. Please refresh the page.');
  }
}
