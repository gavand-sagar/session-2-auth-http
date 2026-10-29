import { Directive, input, output } from '@angular/core';

// Stops double clicks from running an action twice (double orders, double saves).
// After a click, more clicks are ignored for `waitMs` milliseconds.
// Usage: <button appSingleClick (singleClick)="placeOrder()">Place order</button>
@Directive({
  selector: '[appSingleClick]',
  host: { '(click)': 'onClick()' },
})
export class SingleClickDirective {
  waitMs = input(1000);
  singleClick = output<void>();
  private locked = false;

  onClick() {
    if (this.locked) return;
    this.locked = true;
    this.singleClick.emit();
    setTimeout(() => (this.locked = false), this.waitMs());
  }
}
