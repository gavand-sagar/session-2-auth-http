import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../http/loading.service';
import { ConfirmClickDirective } from '../../shared/directives/confirm-click.directive';

/** The frame around every logged-in page: header, navigation, progress bar, page outlet. */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ConfirmClickDirective],
  template: `
    <header class="header">
      <b>{{ appName }}</b>
      <nav>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/products" routerLinkActive="active">Products</a>
        <a routerLink="/directives" routerLinkActive="active">Directives</a>
      </nav>
      <span class="spacer"></span>
      <span>{{ auth.user()?.name }}</span>
      <button class="link" appConfirmClick="Log out now?" (confirmed)="auth.logout()">Logout</button>
    </header>

    @if (loading.isLoading()) {
      <div class="progress"></div>
    }

    <main class="page">
      <router-outlet />
    </main>
  `,
})
export class Shell {
  auth = inject(AuthService);
  loading = inject(LoadingService);
  appName = environment.appName;
}
