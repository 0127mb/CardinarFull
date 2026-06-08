export const CART_STORAGE_KEY = "cardinar_cart";
export const CART_UPDATED_EVENT = "cardinar-cart-updated";

export type CartItem = {
  productId: number;
  articulId?: number;
  title: string;
  price: number;
  image?: string;
  quantity: number;
};

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(CART_STORAGE_KEY);
    return value ? (JSON.parse(value) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addCartItem(item: CartItem) {
  const items = readCart();
  const existing = items.find(
    (entry) =>
      entry.productId === item.productId && entry.articulId === item.articulId,
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    items.push(item);
  }

  writeCart(items);
}

export function updateCartQuantity(index: number, quantity: number) {
  const items = readCart();
  if (!items[index]) return;
  items[index].quantity = Math.max(1, quantity);
  writeCart(items);
}

export function removeCartItem(index: number) {
  writeCart(readCart().filter((_, itemIndex) => itemIndex !== index));
}

export function clearCart() {
  writeCart([]);
}
