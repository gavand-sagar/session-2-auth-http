import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../data/product.model';
import { LowStockDirective } from '../directives/low-stock.directive';

/**
 * PRESENTATIONAL + OnPush: it only re-renders when `products` gets a NEW array.
 * (Edit and Delete buttons are added in Session 4.)
 */
@Component({
  selector: 'app-product-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, LowStockDirective],
  template: `
    <table class="table">
      <thead>
        <tr><th>Name</th><th>Category</th><th class="num">Price</th><th class="num">Stock</th></tr>
      </thead>
      <tbody>
        @for (p of products(); track p.id) {
          <tr>
            <td>{{ p.name }}</td>
            <td><span class="tag">{{ p.category }}</span></td>
            <td class="num">{{ p.price | currency: 'INR' : 'symbol' : '1.0-0' }}</td>
            <td class="num" [appLowStock]="p.stock">{{ p.stock }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class ProductTable {
  products = input.required<Product[]>();
}
