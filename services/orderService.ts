import { BASE_ORDER_ITEM_URL, BASE_ORDER_URL } from "../constants/endpoint";
import api, { apiRequest } from "../lib/axios";
import { OrderResponse } from "../types/api";

interface OrderItems {
  product_variant_id: string;
  quantity: number;
}

//return order_id of creation
export const createOrder = async (
  orderToken: string,
  orderItems: OrderItems[]
): Promise<string> => {
  const response = await apiRequest(() =>
    api.post(BASE_ORDER_URL, {
      order_items: orderItems,
      order_token: orderToken,
    })
  );
  return response?.data?.order.order_token;
};

export const getOrderByOrderToken = async (
  orderId: string
): Promise<OrderResponse> => {
  const response = await apiRequest(() =>
    api.get(`${BASE_ORDER_URL}/${orderId}`)
  );
  const orderResponse: OrderResponse = response?.data.order as OrderResponse;
  return orderResponse;
};

export const updateOrderShippingAddress = async (
  orderTokenId: string,
  shippingAddressId: string
) => {
  const response = await apiRequest(() =>
    api.put(`${BASE_ORDER_URL}/${orderTokenId}`, {
      shipping_address_id: shippingAddressId,
    })
  );
  return response?.data.order;
};

export const updateOrderitemQuantity = async (
  orderToken: string,
  variantId: string,
  quantity: number
) => {
  const response = await apiRequest(
    () =>
      api.put(`${BASE_ORDER_ITEM_URL}/${orderToken}/items/${variantId}`, {
        quantity,
      }),
    { showSuccess: false }
  );
  return response;
};
