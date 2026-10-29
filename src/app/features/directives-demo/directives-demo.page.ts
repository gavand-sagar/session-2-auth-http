import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { PageHeader } from '../../shared/ui/page-header';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';
import { ConfirmClickDirective } from '../../shared/directives/confirm-click.directive';
import { LowStockDirective } from '../products/directives/low-stock.directive';
import { ShowPasswordDirective } from '../../shared/directives/show-password.directive';
import { DigitsOnlyDirective } from '../../shared/directives/digits-only.directive';
import { TrimDirective } from '../../shared/directives/trim.directive';
import { CopyDirective } from '../../shared/directives/copy.directive';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { ImgFallbackDirective } from '../../shared/directives/img-fallback.directive';
import { SingleClickDirective } from '../../shared/directives/single-click.directive';

// A directive adds behaviour to an element that already exists.
// A component = a directive with its own template.
@Component({
  selector: 'app-directives-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeader, NgClass, NgStyle, AutofocusDirective, ConfirmClickDirective, LowStockDirective,
    ShowPasswordDirective, DigitsOnlyDirective, TrimDirective, CopyDirective, ClickOutsideDirective,
    ImgFallbackDirective, SingleClickDirective,
  ],
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
      <h3>5. More small directives (all in shared/directives)</h3>
      <table class="table">
        <thead><tr><th>Directive</th><th>Try it</th><th>Real use</th></tr></thead>
        <tbody>
          <tr>
            <td><code>[appShowPassword]</code></td>
            <td>
              <input type="password" value="secret123" [appShowPassword]="showPw()" />
              <label class="inline"><input type="checkbox" (change)="showPw.set(!showPw())" /> show</label>
            </td>
            <td>login page</td>
          </tr>
          <tr>
            <td><code>appDigitsOnly</code></td>
            <td><input appDigitsOnly placeholder="phone number, try typing letters" /></td>
            <td>phone, PIN code, quantity</td>
          </tr>
          <tr>
            <td><code>appTrim</code></td>
            <td>
              <input appTrim value="   extra spaces   " (blur)="trimmed.set($any($event.target).value)" />
              <span class="muted">click out, value: "{{ trimmed() }}"</span>
            </td>
            <td>login email, any text field</td>
          </tr>
          <tr>
            <td><code>[appCopy]</code></td>
            <td>
              <code>ORD-1042</code>
              <button [appCopy]="'ORD-1042'" (copied)="copied.set($event)">Copy</button>
              @if (copied()) { <span class="muted">copied {{ copied() }}</span> }
            </td>
            <td>order numbers, links, coupon codes</td>
          </tr>
          <tr>
            <td><code>(appClickOutside)</code></td>
            <td>
              <span class="menu-wrap" (appClickOutside)="menuOpen.set(false)">
                <button (click)="menuOpen.set(!menuOpen())">Menu</button>
                @if (menuOpen()) {
                  <span class="menu"><span>Profile</span><span>Settings</span><span>Logout</span></span>
                }
              </span>
              <span class="muted">click anywhere else to close</span>
            </td>
            <td>dropdowns, popups</td>
          </tr>
          <tr>
            <td><code>appImgFallback</code></td>
            <td><img src="/images/missing.png" appImgFallback width="80" alt="product" /></td>
            <td>product pictures, avatars</td>
          </tr>
          <tr>
            <td><code>appSingleClick</code></td>
            <td>
              <button appSingleClick (singleClick)="orders.set(orders() + 1)">Place order</button>
              <span class="muted">double click it: orders placed {{ orders() }}</span>
            </td>
            <td>save and pay buttons</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h3>Where does a directive go?</h3>
      <table class="table">
        <thead><tr><th>Directive</th><th>Folder</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>appAutofocus, appConfirmClick, appTrim, appCopy, ...</td><td><code>shared/directives/</code></td><td>no business rule, any page can use it</td></tr>
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

  showPw = signal(false);
  trimmed = signal('');
  copied = signal('');
  menuOpen = signal(false);
  orders = signal(0);
}
