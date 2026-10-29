import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

// Puts the cursor in this element when the page opens.
// Usage: <input appAutofocus />
@Directive({ selector: '[appAutofocus]' })
export class AutofocusDirective implements AfterViewInit {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}
