import { GET_ALL_CATEGORIES_URL } from "../constants/endpoint";
import api, { apiRequest } from "../lib/axios";
import { Category } from "../types/api";

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiRequest(() => api.get(GET_ALL_CATEGORIES_URL));
    const mappedResponse: Category[] = response?.data.categories as Category[];
    return mappedResponse;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
