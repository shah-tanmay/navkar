import { BASE_CART_URL, BASE_INVENTORY_URL } from "../constants/endpoint";
import api, { apiRequest } from "../lib/axios";

export const heartbeat = async (orderToken: string) => {
  const response = await apiRequest(() =>
    api.post(`${BASE_INVENTORY_URL}/heartbeat`, { order_token: orderToken })
  );
};

export const release = async (orderToken: string) => {
  console.log("Release called with orderToken:", orderToken);
  const response = await apiRequest(() =>
    api.post(`${BASE_INVENTORY_URL}/heartbeat/release`, {
      order_token: orderToken,
    })
  );
};
