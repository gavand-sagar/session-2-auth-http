import { Directive, input, output } from '@angular/core';

// Copies a text to the clipboard on click.
// Usage: <button [appCopy]="orderId" (copied)="notify.success('Copied')">Copy</button>
@Directive({
  selector: '[appCopy]',
  host: { '(click)': 'copy()' },
})
export class CopyDirective {
  text = input.required<string>({ alias: 'appCopy' });
  copied = output<string>();

  copy() {
    navigator.clipboard
      .writeText(this.text())
      .then(() => this.copied.emit(this.text()))
      .catch(() => console.warn('The browser did not allow copying'));
  }
}
