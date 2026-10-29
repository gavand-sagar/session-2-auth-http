import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { PageHeader } from '../../shared/ui/page-header';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';
import { ConfirmClickDirective } from '../../shared/directives/confirm-click.directive';
import { LowStockDirective } from '../products/directives/low-stock.directive';

// A directive adds behaviour to an element that already exists.
// A component = a directive with its own template.
@Component({
  selector: 'app-directives-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, NgClass, NgStyle, AutofocusDirective, ConfirmClickDirective, LowStockDirective],
  template: `
    <app-page-header title="Directives" />

    <div class="card">
      <h3>1. Built in: changing classes and styles</h3>
      <label>Stock <input type="number" [value]="stock()" (input)="stock.set(+$any($event.target).value)" /></label>
      <table class="table">
        <thead><tr><th>Template</th><th>Result</th></tr></thead>
        <tbody>
          <tr><td><code>[class.low]="stock &lt; 5"</code></td><td [class.low]="stock() < 5">{{ stock() }}</td></tr>
          <tr><td><code>[style.font-weight]="stock &lt; 5 ? 'bold' : 'normal'"</code></td><td [style.font-weight]="stock() < 5 ? 'bold' : 'normal'">{{ stock() }}</td></tr>
          <tr><td><code>[ngClass]="{{ '{' }} low: stock &lt; 5, muted: stock &gt; 20 {{ '}' }}"</code></td><td [ngClass]="{ low: stock() < 5, muted: stock() > 20 }">{{ stock() }}</td></tr>
          <tr><td><code>[ngStyle]="{{ '{' }} 'font-size.px': 14 + stock / 2 {{ '}' }}"</code></td><td [ngStyle]="{ 'font-size.px': 14 + stock() / 2 }">{{ stock() }}</td></tr>
        </tbody>
      </table>
      <p class="muted">For one class or one style, plain [class.x] and [style.x] are enough. ngClass / ngStyle are for many at once.</p>
    </div>

    <div class="card">
      <h3>2. appAutofocus (shared/directives)</h3>
      <p class="muted">No inputs, no outputs. Just gets the element and calls focus(). Also used on the login page.</p>
      <input appAutofocus placeholder="the cursor starts here" />
    </div>

    <div class="card">
      <h3>3. appLowStock (features/products/directives)</h3>
      <p class="muted">Takes the stock as input and adds the "low" class itself. The Products table uses it too.</p>
      <label>Low stock limit: {{ limit() }} <input type="range" min="1" max="20" [value]="limit()" (input)="limit.set(+$any($event.target).value)" /></label>
      <p>Stock {{ stock() }}: <b [appLowStock]="stock()" [limit]="limit()">{{ stock() < limit() ? 'low' : 'ok' }}</b></p>
    </div>

    <div class="card">
      <h3>4. appConfirmClick (shared/directives)</h3>
      <p class="muted">Listens to click, asks first, and only then emits (confirmed). The Logout button uses it.</p>
      <button appConfirmClick="Delete all items?" (confirmed)="deleted.set(deleted() + 1)">Delete all</button>
      <span class="muted"> confirmed {{ deleted() }} times</span>
    </div>

    <div class="card">
      <h3>Where does a directive go?</h3>
      <table class="table">
        <thead><tr><th>Directive</th><th>Folder</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>appAutofocus, appConfirmClick</td><td><code>shared/directives/</code></td><td>no business rule, any page can use it</td></tr>
          <tr><td>appLowStock</td><td><code>features/products/directives/</code></td><td>knows the products rule for low stock</td></tr>
        </tbody>
      </table>
    </div>
  `,
})
export default class DirectivesDemoPage {
  stock = signal(3);
  limit = signal(5);
  deleted = signal(0);
}
