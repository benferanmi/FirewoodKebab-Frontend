import client from "./client";

export const settingsAPI = {
  getPublic: () => client.get("/settings/public"),
  getDeliverySettings: () => client.get("/settings/delivery"),
};
