import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { Shell } from './core/layout/shell';

/**
 * Top-level routes. Every feature is LAZY: its code is only downloaded when you first open it.
 * The Shell (header + nav) is protected once by authGuard, so every child page is protected.
 */
export const routes: Routes = [
  { path: 'login', title: 'Login', loadComponent: () => import('./features/auth/login.page') },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', title: 'Dashboard', loadComponent: () => import('./features/dashboard/dashboard.page') },
      { path: 'products', loadChildren: () => import('./features/products/products.routes') },
      { path: 'directives', title: 'Directives', loadComponent: () => import('./features/directives-demo/directives-demo.page') },
    ],
  },
  { path: '**', redirectTo: '' },
];
