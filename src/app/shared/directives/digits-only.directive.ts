import { Directive } from '@angular/core';

// Lets the user type numbers only. Good for phone, PIN code, quantity.
// Usage: <input appDigitsOnly />
@Directive({
  selector: 'input[appDigitsOnly]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(paste)': 'onPaste($event)',
  },
})
export class DigitsOnlyDirective {
  private allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];

  onKeyDown(event: KeyboardEvent) {
    if (this.allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) return;
    if (!/^[0-9]$/.test(event.key)) event.preventDefault();
  }

  onPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text') ?? '';
    if (!/^[0-9]*$/.test(text)) event.preventDefault();
  }
}
