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
  orderItems: OrderItems[],
  couponCode?: string
): Promise<string> => {
  const response = await apiRequest(() =>
    api.post(BASE_ORDER_URL, {
      order_items: orderItems,
      order_token: orderToken,
      coupon_code: couponCode,
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

export const updateOrder = async (
  orderTokenId: string,
  updateData: { shipping_address_id?: string; metadata?: any; coupon_code?: string | null }
) => {
  const response = await apiRequest(() =>
    api.put(`${BASE_ORDER_URL}/${orderTokenId}`, updateData)
  );
  return response?.data.order;
};

export const getAllUserOrders = async (): Promise<OrderResponse[]> => {
  const response = await apiRequest(() => api.get(BASE_ORDER_URL));
  const orders: OrderResponse[] = response?.data.orders as OrderResponse[];
  return orders;
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
