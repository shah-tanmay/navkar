import axios, { AxiosResponse } from "axios";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CUSTOM_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session && session.token) {
    config.headers.Authorization = `Bearer ${session.token.accessToken}`;
  }
  return config;
});

export const apiRequest = async <T>(
  request: () => Promise<AxiosResponse<T>>,
  options?: {
    showSuccess?: boolean;
    successStatusCode?: number;
  }
): Promise<AxiosResponse<T> | null> => {
  try {
    const result = await request();
    if (
      options?.showSuccess &&
      result.status === (options.successStatusCode ?? 200)
    ) {
      toast.success((result.data as any)?.message || "Operation successful");
    }
    return result;
  } catch (error: any) {
    console.error("API request error:", error);
    toast.error(
      error.response?.data?.message || error.message || "An error occurred"
    );
    return null;
  }
};
export default api;
