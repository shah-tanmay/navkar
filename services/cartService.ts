import { BASE_CART_URL } from "../constants/endpoint";
import api, { apiRequest } from "../lib/axios";
import { CartItems, ViewCartResponse } from "../types/api";

export const getCartItems = async () => {
  const response = await apiRequest(() => api.get(BASE_CART_URL));
  const mappedResponse: CartItems[] = response?.data.cartItems;
  return mappedResponse;
};

export const addItemToCart = async (variantId: string, quantity: number) => {
  const response = await apiRequest(
    () =>
      api.post(BASE_CART_URL, {
        product_variant_id: variantId,
        quantity,
      }),
    { successStatusCode: 201, showSuccess: true }
  );
  const mappedResponse = response?.data;
  return mappedResponse;
};

export const removeItemFromCart = async (cartItemId: string) => {
  const response = await apiRequest(
    () => api.delete(`${BASE_CART_URL}/${cartItemId}`),
    { showSuccess: true, successStatusCode: 200 }
  );
  return response?.data;
};

export const updateItemQuantity = async (
  cartItemId: string,
  quantity: number
) => {
  const response = await apiRequest(() =>
    api.put(`${BASE_CART_URL}/${cartItemId}`, { quantity })
  );
  return response?.data;
};
