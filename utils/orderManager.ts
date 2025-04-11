import { nanoid } from "nanoid";
import { createOrder, updateOrderitemQuantity } from "../services/orderService";

const STORAGE_KEY_PREFIX = "buy_now_";

export const getOrCreateOrderToken = async (
  variantId: string,
  quantity: number
): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  const key = `${STORAGE_KEY_PREFIX}${variantId}`;
  let token = localStorage.getItem(key);

  if (!token) {
    token = nanoid();
    localStorage.setItem(key, token);
    const orderItems = [
      {
        product_variant_id: variantId,
        quantity,
      },
    ];
    await createOrder(token, orderItems);
  } else {
    await updateOrderitemQuantity(token, variantId, quantity);
  }

  return token;
};

export const clearOrderToken = (variantId: string): void => {
  if (typeof window !== "undefined") {
    //update orderstatus here.
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${variantId}`);
  }
};
