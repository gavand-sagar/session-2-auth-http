import { Directive, computed, input } from '@angular/core';

// Products only: marks a stock value red when it is low.
// It knows the "low stock" rule, so it lives in the products feature, not in shared.
// Usage: <td [appLowStock]="product.stock">{{ product.stock }}</td>
@Directive({
  selector: '[appLowStock]',
  host: {
    '[class.low]': 'isLow()',
    '[attr.title]': 'isLow() ? "Low stock, reorder soon" : null',
  },
})
export class LowStockDirective {
  stock = input.required<number>({ alias: 'appLowStock' });
  limit = input(5);

  isLow = computed(() => this.stock() < this.limit());
}
