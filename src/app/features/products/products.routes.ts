import { Routes } from '@angular/router';
import { ProductListPage } from './pages/product-list.page';

/** Lazy loaded from app.routes.ts. Everything in this feature lands in its own JS chunk. */
export default [{ path: '', component: ProductListPage, title: 'Products' }] satisfies Routes;
