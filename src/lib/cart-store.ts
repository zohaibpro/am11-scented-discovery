import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  CART_ADD,
  CART_CREATE,
  CART_QUERY,
  CART_REMOVE,
  CART_UPDATE,
  cartErrors,
  formatCheckoutUrl,
  storefrontRequest,
  updateCartNote as updateShopifyCartNote,
  type CartLine,
  type Money,
  type ShopifyProduct,
  type ShopifyVariant,
} from "@/lib/shopify-storefront";

export type CartItem = {
  lineId: string;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: Money;
  quantity: number;
  selectedOptions: { name: string; value: string }[];
};

type CartData = { id: string; checkoutUrl: string; lines: { edges: { node: { id: string; quantity?: number; merchandise: { id: string } } }[] } };
type CartStore = {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  error: string | null;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  updateCartNote: (note: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
};

function lineToItem(line: CartLine, product: ShopifyProduct): CartItem {
  const variant = line.merchandise as ShopifyVariant;
  return {
    lineId: line.id,
    product,
    variantId: variant.id,
    variantTitle: variant.title,
    price: variant.price,
    quantity: line.quantity,
    selectedOptions: variant.selectedOptions,
  };
}

function findLineId(cart: CartData, variantId: string) {
  return cart.lines.edges.find((edge) => edge.node.merchandise.id === variantId)?.node.id;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      error: null,
      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null, error: null }),
      addItem: async (item) => {
        set({ isLoading: true, error: null });
        try {
          const existing = get().items.find((entry) => entry.variantId === item.variantId);
          const cartId = get().cartId;
          if (!cartId) {
            const data = await storefrontRequest<{
              cartCreate: { cart: CartData | null; userErrors: { message: string }[] };
            }>(CART_CREATE, { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] });
            cartErrors(data.cartCreate.userErrors);
            const cart = data.cartCreate.cart;
            if (!cart?.checkoutUrl) throw new Error("Could not start a Shopify cart.");
            const lineId = findLineId(cart, item.variantId);
            if (!lineId) throw new Error("Shopify did not return the cart line.");
            set({ cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), items: [{ ...item, lineId }] });
          } else if (existing) {
            await storefrontRequest<{ cartLinesUpdate: { userErrors: { message: string }[] } }>(CART_UPDATE, {
              cartId,
              lines: [{ id: existing.lineId, quantity: existing.quantity + item.quantity }],
            }).then((result) => cartErrors(result.cartLinesUpdate.userErrors));
            set({ items: get().items.map((entry) => entry.variantId === item.variantId ? { ...entry, quantity: entry.quantity + item.quantity } : entry) });
          } else {
            const data = await storefrontRequest<{
              cartLinesAdd: { cart: CartData | null; userErrors: { message: string }[] };
            }>(CART_ADD, { cartId, lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] });
            cartErrors(data.cartLinesAdd.userErrors);
            const cart = data.cartLinesAdd.cart;
            if (!cart) throw new Error("Shopify did not return the updated cart.");
            const lineId = findLineId(cart, item.variantId);
            if (!lineId) throw new Error("Shopify did not return the cart line.");
            set({ checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), items: [...get().items, { ...item, lineId }] });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Could not update the cart." });
        } finally {
          set({ isLoading: false });
        }
      },
      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        const item = get().items.find((entry) => entry.variantId === variantId);
        const cartId = get().cartId;
        if (!item || !cartId) return;
        set({ isLoading: true, error: null });
        try {
          const data = await storefrontRequest<{ cartLinesUpdate: { userErrors: { message: string }[] } }>(CART_UPDATE, {
            cartId,
            lines: [{ id: item.lineId, quantity }],
          });
          cartErrors(data.cartLinesUpdate.userErrors);
          set({ items: get().items.map((entry) => entry.variantId === variantId ? { ...entry, quantity } : entry) });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Could not update the cart." });
        } finally {
          set({ isLoading: false });
        }
      },
      removeItem: async (variantId) => {
        const item = get().items.find((entry) => entry.variantId === variantId);
        const cartId = get().cartId;
        if (!item || !cartId) return;
        set({ isLoading: true, error: null });
        try {
          const data = await storefrontRequest<{ cartLinesRemove: { userErrors: { message: string }[] } }>(CART_REMOVE, {
            cartId,
            lineIds: [item.lineId],
          });
          cartErrors(data.cartLinesRemove.userErrors);
          const items = get().items.filter((entry) => entry.variantId !== variantId);
          if (items.length === 0) get().clearCart();
          else set({ items });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Could not remove this item." });
        } finally {
          set({ isLoading: false });
        }
      },
      updateCartNote: async (note) => {
        const cartId = get().cartId;
        if (!cartId) {
          set({ error: "Add your fragrances to the bag before saving a gift note." });
          return;
        }
        set({ isLoading: true, error: null });
        try {
          await updateShopifyCartNote(cartId, note);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Could not save the gift note." });
        } finally {
          set({ isLoading: false });
        }
      },
      syncCart: async () => {
        const cartId = get().cartId;
        if (!cartId) return;
        try {
          const data = await storefrontRequest<{ cart: { totalQuantity: number } | null }>(CART_QUERY, { id: cartId });
          if (!data.cart || data.cart.totalQuantity === 0) get().clearCart();
        } catch {
          // Keep a saved cart when the API is temporarily unavailable.
        }
      },
    }),
    {
      name: "am11-shopify-cart",
      partialize: (state) => ({ items: state.items, cartId: state.cartId, checkoutUrl: state.checkoutUrl }),
    },
  ),
);