import { nanoid } from "nanoid";
import { createOrder, updateOrderitemQuantity } from "../services/orderService";

const STORAGE_KEY_PREFIX = "buy_now_";

export const getOrCreateOrderToken = async (
  variantId: string,
  quantity: number,
  userId?: string,
  metadata?: any
): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  // Create a unique key based on variant, quantity, and dimensions
  const metaHash = metadata ? JSON.stringify(metadata) : "none";
  const key = `${STORAGE_KEY_PREFIX}${userId || "guest"}_${variantId}_q${quantity}_m${metaHash}`;
  
  // We check if an order with these EXACT specs already exists in this session
  let token = localStorage.getItem(key);

  if (!token) {
    token = nanoid();
    localStorage.setItem(key, token);
    const orderItems = [
      {
        product_variant_id: variantId,
        quantity,
        metadata,
      },
    ];
    await createOrder(token, orderItems);
  } else {
    // Even if we have a token, we ensure the backend item is synced (especially for quantity changes)
    await updateOrderitemQuantity(token, variantId, quantity, { metadata });
  }

  return token;
};

export const clearOrderToken = (variantId: string, userId?: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${userId || "guest"}_${variantId}`);
  }
};

export const generateFreshOrderToken = async (
  variantId: string,
  quantity: number,
  userId?: string,
  metadata?: any
): Promise<string | null> => {
  const token = nanoid();
  const orderItems = [
    {
      product_variant_id: variantId,
      quantity,
      metadata,
    },
  ];
  await createOrder(token, orderItems);
  return token;
};
