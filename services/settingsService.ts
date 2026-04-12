import api, { apiRequest } from "../lib/axios";

export const getSiteSettings = async () => {
  const response = await apiRequest(() => api.get("/admin/settings"));
  return response?.data || {};
};

export const updateSiteSetting = async (key: string, value: any) => {
  const response = await apiRequest(() => api.post("/admin/settings", { key, value }));
  return response?.data;
};
