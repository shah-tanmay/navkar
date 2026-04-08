import { toast } from "react-toastify";
import { PAYMENT_URL } from "../constants/endpoint";
import api, { apiRequest } from "../lib/axios";
import { PaymentDetails } from "../types/api";

export const getPaymentSessionId = async (
  orderToken: string
): Promise<PaymentDetails> => {
  if (!orderToken) {
    toast.error("Payment failed to initialize. Please try again.");
    return {} as PaymentDetails;
  }
  const response = await apiRequest(() =>
    api.post(`${PAYMENT_URL}`, { order_token: orderToken })
  );
  const paymentDetails: PaymentDetails = response?.data;
  return paymentDetails;
};

export const verifyPayment = async (orderToken: string): Promise<boolean> => {
  if (!orderToken) {
    toast.error("Failed to verify payment");
    return false;
  }
  const response = await apiRequest(() =>
    api.post(`${PAYMENT_URL}/verify`, { order_token: orderToken })
  );
  const verified = response?.data?.verified;
  return verified;
};
