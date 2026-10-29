import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Reusable page title. Buttons go inside it (content projection):
 *   <app-page-header title="Products"><button>New</button></app-page-header>
 */
@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <h1>{{ title() }}</h1>
      <div class="actions"><ng-content /></div>
    </div>
  `,
})
export class PageHeader {
  title = input.required<string>();
}
