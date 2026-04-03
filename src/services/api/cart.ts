import client from "./client";
import type { AddCartItemDTO } from "@/types";

export const cartAPI = {
  getCart: () => client.get("/cart"),
  addItem: (data: AddCartItemDTO) => client.post("/cart/add", data),
  updateItem: (itemId: string, quantity: number) =>
    client.put(`/cart/update/${itemId}`, { quantity }),
  removeItem: (itemId: string) => client.delete(`/cart/remove/${itemId}`),
  applyCoupon: (couponCode: string) =>
    client.post("/cart/apply-coupon", { couponCode }),
  removeCoupon: () => client.delete("/cart/remove-coupon"),
  clearCart: () => client.delete("/cart/clear"),
  migrateCart: async (guestCartId: string) => {
    const response = await client.post("/cart/migrate", {
      guestCartId,
    });
    return response.data;
  },
};
