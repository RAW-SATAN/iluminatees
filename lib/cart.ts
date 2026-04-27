import type { ProductSize } from "./products";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: ProductSize;
  quantity: number;
  shirtColor: string;
  symbol: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: ProductSize) => void;
  updateQuantity: (productId: string, size: ProductSize, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}
