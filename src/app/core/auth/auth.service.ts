import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from '../config';

export interface User {
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Owns the session: token + current user.
 * - The authInterceptor reads token() to sign every request.
 * - The authGuard reads isLoggedIn() to protect routes.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private url = inject(API_URL);

  private readonly _token = signal<string | null>(localStorage.getItem('token'));
  private readonly _user = signal<User | null>(JSON.parse(localStorage.getItem('user') ?? 'null'));

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== null);

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.url}/auth/login`, { email, password })
      .pipe(tap((res) => this.setSession(res.token, res.user)));
  }

  /** Clear the session and go to the login page (remembering where we were). */
  logout(returnUrl?: string) {
    this.setSession(null, null);
    this.router.navigate(['/login'], { queryParams: returnUrl ? { returnUrl } : {} });
  }

  private setSession(token: string | null, user: User | null) {
    this._token.set(token);
    this._user.set(user);
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
}
