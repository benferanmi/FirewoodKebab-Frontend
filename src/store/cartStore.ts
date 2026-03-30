import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Coupon, Address } from "@/types";
import { cartAPI } from "@/services/api/cart";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  deliveryType: "delivery" | "collection";
  deliveryAddress: Address | null;
  isCartOpen: boolean;

  addItem: (item: Omit<CartItem, "id" | "itemTotal">) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  setDeliveryType: (type: "delivery" | "collection") => void;
  setDeliveryAddress: (address: Address | null) => void;
  setCartOpen: (open: boolean) => void;
  syncFromServer: () => Promise<void>; // call this on login

  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const isLoggedIn = () => useAuthStore.getState().isAuthenticated();

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      deliveryType: "delivery",
      deliveryAddress: null,
      isCartOpen: false,

      addItem: async (item) => {
        // Optimistic local update first
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) =>
            i.menuItemId === item.menuItemId &&
            JSON.stringify(i.variants) === JSON.stringify(item.variants),
        );

        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + item.quantity,
            itemTotal:
              (updated[existingIndex].quantity + item.quantity) *
              updated[existingIndex].price,
          };
          set({ items: updated });
        } else {
          const variantCost =
            item.variants?.reduce((s, v) => s + v.additionalPrice, 0) || 0;
          const newItem: CartItem = {
            ...item,
            id: `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            itemTotal: item.quantity * (item.price + variantCost),
          };
          set({ items: [...items, newItem] });
        }

        // Sync to API if logged in
        if (isLoggedIn()) {
          try {
            const { data } = await cartAPI.addItem({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              variants: item.variants,
              notes: item.notes,
            });
            // Replace local state with server state
            set({ items: data.data.items, coupon: data.data.coupon ?? null });
          } catch {
            toast.error("Failed to sync cart with server");
          }
        }
      },

      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        // Optimistic local update
        set({
          items: get().items.map((item) =>
            item.id === id
              ? { ...item, quantity, itemTotal: quantity * item.price }
              : item,
          ),
        });

        if (isLoggedIn()) {
          try {
            const { data } = await cartAPI.updateItem(id, quantity);
            set({ items: data.data.items, coupon: data.data.coupon ?? null });
          } catch {
            toast.error("Failed to sync cart with server");
          }
        }
      },

      removeItem: async (id) => {
        // Optimistic local update
        set({ items: get().items.filter((i) => i.id !== id) });

        if (isLoggedIn()) {
          try {
            const { data } = await cartAPI.removeItem(id);
            set({ items: data.data.items, coupon: data.data.coupon ?? null });
          } catch {
            toast.error("Failed to sync cart with server");
          }
        }
      },

      clearCart: async () => {
        set({ items: [], coupon: null });

        if (isLoggedIn()) {
          try {
            await cartAPI.clearCart();
          } catch {
            toast.error("Failed to clear cart on server");
          }
        }
      },

      applyCoupon: async (code) => {
        if (isLoggedIn()) {
          try {
            const { data } = await cartAPI.applyCoupon(code);
            set({ coupon: data.data.coupon, items: data.data.items });
            toast.success("Coupon applied!");
          } catch (error: any) {
            toast.error(error?.response?.data?.message || "Invalid coupon");
          }
        } else {
          toast.error("Please log in to apply a coupon");
        }
      },

      removeCoupon: async () => {
        set({ coupon: null });

        if (isLoggedIn()) {
          try {
            const { data } = await cartAPI.removeCoupon();
            set({ items: data.data.items, coupon: null });
          } catch {
            toast.error("Failed to remove coupon");
          }
        }
      },

      setCoupon: (coupon) => set({ coupon }),
      setDeliveryType: (deliveryType) => set({ deliveryType }),
      setDeliveryAddress: (deliveryAddress) => set({ deliveryAddress }),
      setCartOpen: (isCartOpen) => set({ isCartOpen }),

      // Call this right after login to pull server cart into local state
      syncFromServer: async () => {
        if (!isLoggedIn()) return;
        try {
          const { data } = await cartAPI.getCart();
          set({
            items: data.data.items ?? [],
            coupon: data.data.coupon ?? null,
          });
        } catch {
          toast.error("Failed to load cart");
        }
      },

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.itemTotal, 0),
      getDeliveryFee: () => (get().deliveryType === "delivery" ? 500 : 0),
      getDiscount: () => {
        const coupon = get().coupon;
        if (!coupon) return 0;
        const subtotal = get().getSubtotal();
        if (coupon.type === "percentage")
          return Math.round(subtotal * (coupon.value / 100));
        return coupon.value;
      },
      getTotal: () =>
        get().getSubtotal() + get().getDeliveryFee() - get().getDiscount(),
      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        deliveryType: state.deliveryType,
      }),
    },
  ),
);
