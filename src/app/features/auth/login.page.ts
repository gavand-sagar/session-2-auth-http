import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { errorMessage } from '../../core/errors/error-message';
import { FieldError } from '../../shared/ui/field-error';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FieldError, AutofocusDirective],
  template: `
    <div class="login-card">
      <h1>{{ appName }}</h1>
      <p class="muted">Demo login: admin&#64;shop.test / admin123</p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Email <input type="email" formControlName="email" autocomplete="username" appAutofocus /></label>
        <app-field-error [control]="form.controls.email" />

        <label>Password <input type="password" formControlName="password" autocomplete="current-password" /></label>
        <app-field-error [control]="form.controls.password" />

        @if (error()) {
          <p class="error-text">{{ error() }}</p>
        }
        <button class="primary" type="submit" [disabled]="submitting()">
          {{ submitting() ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  `,
})
export default class LoginPage {
  /** From the URL: /login?returnUrl=/products (set by the authGuard). */
  returnUrl = input<string>();

  private auth = inject(AuthService);
  private router = inject(Router);
  appName = environment.appName;

  submitting = signal(false);
  error = signal('');

  form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl() || '/dashboard'),
      error: (err) => {
        this.error.set(errorMessage(err));
        this.submitting.set(false);
      },
    });
  }
}
