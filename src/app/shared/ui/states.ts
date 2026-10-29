import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/*
 * The three states every data page needs. Same look everywhere in the app.
 *
 *   @if (loading()) { <app-loading /> }
 *   @else if (error()) { <app-error [message]="error()" (retry)="load()" /> }
 *   @else if (!items().length) { <app-empty message="No products yet" /> }
 *   @else { ...the real content... }
 */

@Component({
  selector: 'app-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="state"><span class="spinner"></span> {{ message() }}</div>`,
})
export class LoadingState {
  message = input('Loading...');
}

@Component({
  selector: 'app-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="state error-state">
      <p>{{ message() }}</p>
      <button (click)="retry.emit()">Try again</button>
    </div>
  `,
})
export class ErrorState {
  message = input.required<string>();
  retry = output();
}

@Component({
  selector: 'app-empty',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="state"><p>{{ message() }}</p><ng-content /></div>`,
})
export class EmptyState {
  message = input('Nothing here yet');
}
