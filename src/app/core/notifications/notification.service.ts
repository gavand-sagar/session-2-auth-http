import { ChangeDetectionStrategy, Component, Injectable, inject, signal } from '@angular/core';

interface Toast {
  id: number;
  text: string;
  type: 'success' | 'error';
}

/** App-wide toast messages. Any component, service or interceptor can call it. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  readonly toasts = signal<Toast[]>([]);

  success(text: string) {
    this.show(text, 'success');
  }

  error(text: string) {
    this.show(text, 'error');
  }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private show(text: string, type: Toast['type']) {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, text, type }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}

@Component({
  selector: 'app-toasts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts">
      @for (t of notify.toasts(); track t.id) {
        <div class="toast" [class]="t.type" (click)="notify.dismiss(t.id)">{{ t.text }}</div>
      }
    </div>
  `,
})
export class Toasts {
  notify = inject(NotificationService);
}
