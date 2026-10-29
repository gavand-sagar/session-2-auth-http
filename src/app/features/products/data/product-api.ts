import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from '../../../core/config';
import { Product, ProductQuery, ProductStats } from './product.model';

/** The ONLY place that knows the product URLs. Typed, returns Observables, no UI code. */
@Injectable({ providedIn: 'root' })
export class ProductApi {
  private http = inject(HttpClient);
  private baseUrl = inject(API_URL);
  private url = `${this.baseUrl}/products`;

  /** GET /api/products?search=&category=&sort= (empty values are not sent) */
  list(query: ProductQuery) {
    let params = new HttpParams().set('sort', query.sort);
    if (query.search) params = params.set('search', query.search);
    if (query.category) params = params.set('category', query.category);
    return this.http.get<Product[]>(this.url, { params });
  }

  stats() {
    return this.http.get<ProductStats>(`${this.baseUrl}/stats`);
  }
}
