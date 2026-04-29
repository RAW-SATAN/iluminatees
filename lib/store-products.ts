import type { ProductSize, ProductCategory } from './products';

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  codename: string;
  category: ProductCategory | string;
  price: number;
  originalPrice?: number;
  description: string;
  sizes: ProductSize[];
  inStock: boolean;
  limited: boolean;
  tags: string[];
  status: 'active' | 'draft';
  inventory: number;
  sku: string;
  weight: number;
  shirtColor: string;
  accentColor: string;
  createdAt: string;
  updatedAt: string;
}

const KEY = 'ilum_admin_products';

export function getAdminProducts(): AdminProduct[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function saveAdminProduct(p: AdminProduct): void {
  const all = getAdminProducts();
  const idx = all.findIndex(x => x.id === p.id);
  if (idx >= 0) all[idx] = p; else all.unshift(p);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function deleteAdminProduct(id: string): void {
  const all = getAdminProducts().filter(p => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function genSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
