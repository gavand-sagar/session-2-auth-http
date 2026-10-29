import { Directive, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

// Removes spaces at the start and end when the user leaves the field.
// Works with reactive forms too (it updates the form value, not just the screen).
// Usage: <input formControlName="email" appTrim />
// <button (appTrim)>
@Directive({
  selector: 'input[appTrim]',
  host: { '(blur)': 'trim()' },
})
export class TrimDirective {
  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private ngControl = inject(NgControl, { optional: true, self: true });

  trim() {
    const value = this.el.nativeElement.value;
    const trimmed = value.trim();
    if (trimmed === value) return;

    if (this.ngControl?.control) {
      this.ngControl.control.setValue(trimmed);
    } else {
      this.el.nativeElement.value = trimmed;
    }
  }
}
