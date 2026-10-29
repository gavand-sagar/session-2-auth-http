import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * The API base URL, read from the environment file.
 * Services inject this instead of importing `environment` everywhere,
 * so tests can replace it easily.
 */
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl,
});
