import { Directive, ElementRef, inject, output } from '@angular/core';

// Tells you when the user clicks anywhere outside this element.
// Typical use: close a dropdown or a popup.
// Usage: <div class="menu" (appClickOutside)="open.set(false)">...</div>
@Directive({
  selector: '[appClickOutside]',
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class ClickOutsideDirective {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  clickOutside = output<void>({ alias: 'appClickOutside' });

  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.clickOutside.emit();
    }
  }
}
