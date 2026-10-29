import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { errorMessage } from '../../core/errors/error-message';
import { PageHeader } from '../../shared/ui/page-header';
import { ErrorState, LoadingState } from '../../shared/ui/states';
import { ProductApi } from '../products/data/product-api';
import { ProductStats } from '../products/data/product.model';

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, KeyValuePipe, PageHeader, LoadingState, ErrorState],
  template: `
    <app-page-header [title]="'Welcome, ' + (auth.user()?.name ?? '')" />

    @if (loading()) {
      <app-loading message="Loading dashboard..." />
    } @else if (error()) {
      <app-error [message]="error()" (retry)="load()" />
    } @else if (stats(); as s) {
      <div class="cards">
        <div class="card stat"><span>Products</span><b>{{ s.totalProducts }}</b></div>
        <div class="card stat"><span>Stock value</span><b>{{ s.stockValue | currency: 'INR' : 'symbol' : '1.0-0' }}</b></div>
        <div class="card stat"><span>Low stock</span><b [class.low]="s.lowStock.length">{{ s.lowStock.length }}</b></div>
      </div>

      <div class="cards">
        <div class="card">
          <h3>By category</h3>
          @for (c of s.byCategory | keyvalue; track c.key) {
            <div class="line"><span class="tag">{{ c.key }}</span><span>{{ c.value }}</span></div>
          }
        </div>
        <div class="card">
          <h3>Low stock (under 5)</h3>
          @for (p of s.lowStock; track p.id) {
            <div class="line">
              <span>{{ p.name }}</span>
              <span class="low">{{ p.stock }} left</span>
            </div>
          } @empty {
            <p class="muted">All products are well stocked.</p>
          }
        </div>
      </div>
    }
  `,
})
export default class DashboardPage {
  auth = inject(AuthService);
  private api = inject(ProductApi);

  stats = signal<ProductStats | null>(null);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.api.stats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }
}
