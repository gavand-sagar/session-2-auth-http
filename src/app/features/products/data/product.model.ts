export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  stock: number;
}

export const CATEGORIES = ['electronics', 'books', 'toys', 'home'] as const;
export type Category = (typeof CATEGORIES)[number];

export interface ProductQuery {
  search: string;
  category: Category | '';
  sort: 'name' | 'price';
}

export interface ProductStats {
  totalProducts: number;
  stockValue: number;
  lowStock: Product[];
  byCategory: Record<Category, number>;
}
