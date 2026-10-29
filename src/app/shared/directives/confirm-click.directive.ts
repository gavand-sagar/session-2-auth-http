import { Directive, input, output } from '@angular/core';

// Asks "are you sure?" before doing something.
// Usage: <button appConfirmClick="Log out now?" (confirmed)="logout()">Logout</button>
@Directive({
  selector: '[appConfirmClick]',
  host: { '(click)': 'onClick()' },
})
export class ConfirmClickDirective {
  message = input('', { alias: 'appConfirmClick' });
  confirmed = output<void>();

  onClick() {
    if (confirm(this.message() || 'Are you sure?')) {
      this.confirmed.emit();
    }
  }
}
