import client from "./client";

interface PaymentOptions {
  tipsEnabled: boolean;
  tipPercentages: number[];
  cashOnDeliveryEnabled: boolean;
  currency: string;
}
export const settingsAPI = {
  getPublic: () => client.get("/settings/public"),
  getDeliverySettings: () => client.get("/settings/delivery"),
  getPaymentOptions: () =>
  client.get("/settings/payment-options").then((r) => r.data.data as PaymentOptions),
};
