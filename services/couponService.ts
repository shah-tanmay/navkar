import axios from "../lib/axios";

export const validateCoupon = async (code: string) => {
  try {
    const response = await axios.get(`/coupons/validate/${code}`);
    return response.data.coupon;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("Invalid or expired coupon code");
    }
    throw new Error("Failed to validate coupon");
  }
};
