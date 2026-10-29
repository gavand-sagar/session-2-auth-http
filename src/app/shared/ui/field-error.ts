import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const MESSAGES: Record<string, (e: any) => string> = {
  required: () => 'This field is required',
  email: () => 'Enter a valid email',
  minlength: (e) => `At least ${e.requiredLength} characters`,
  min: (e) => `Must be at least ${e.min}`,
  server: (e) => e, // message that came back from the API
};

/**
 * Shows the first error of a form control, after the user has touched it.
 *
 * Why NOT OnPush here? Reactive form state (errors, touched) is not a signal and the
 * `control` input never changes (same object). With OnPush this component would never
 * re-render when errors appear. Default lets the parent's checks reach it.
 */
@Component({
  selector: 'app-field-error',
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (message(); as text) {
      <small class="field-error">{{ text }}</small>
    }
  `,
})
export class FieldError {
  control = input.required<AbstractControl>();

  message() {
    const c = this.control();
    if (!c.errors || !(c.touched || c.dirty)) return null;
    const [key, value] = Object.entries(c.errors)[0];
    return MESSAGES[key]?.(value) ?? 'Invalid value';
  }
}
