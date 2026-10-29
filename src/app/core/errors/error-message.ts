import { HttpErrorResponse } from '@angular/common/http';

/** One readable sentence for any error. */
export function errorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'The server could not be reached.';
    return err.error?.message ?? `Request failed (${err.status}).`;
  }
  return err instanceof Error ? err.message : 'Something went wrong.';
}
