import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { errorMessage } from '../../../core/errors/error-message';
import { PageHeader } from '../../../shared/ui/page-header';
import { EmptyState, ErrorState, LoadingState } from '../../../shared/ui/states';
import { ProductTable } from '../components/product-table';
import { ProductApi } from '../data/product-api';
import { Product } from '../data/product.model';

/**
 * SMART page: loads products from the API and shows the 4 states.
 * The token, the progress bar and 401/500 handling come from the interceptors,
 * so none of that code is here.
 * (Search and filters arrive in Session 3.)
 */
@Component({
  selector: 'app-product-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, ProductTable, LoadingState, ErrorState, EmptyState],
  template: `
    <app-page-header title="Products" />

    @if (loading()) {
      <app-loading message="Loading products..." />
    } @else if (error()) {
      <app-error [message]="error()" (retry)="load()" />
    } @else if (!products().length) {
      <app-empty message="No products yet" />
    } @else {
      <app-product-table [products]="products()" />
    }
  `,
})
export class ProductListPage {
  private api = inject(ProductApi);

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.api.list({ search: '', category: '', sort: 'name' }).subscribe({
      next: (list) => {
        this.products.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }
}
