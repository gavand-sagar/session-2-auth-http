import { Injectable, computed, signal } from '@angular/core';

/** Counts HTTP requests in flight. The shell shows a progress bar while it's above 0. */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly inFlight = signal(0);
  readonly isLoading = computed(() => this.inFlight() > 0);

  start() {
    this.inFlight.update((n) => n + 1);
  }

  stop() {
    this.inFlight.update((n) => Math.max(0, n - 1));
  }
}
