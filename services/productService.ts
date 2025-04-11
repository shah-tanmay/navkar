import { GET_ALL_PRODUCTS } from "../constants/endpoint";
import api, { apiRequest } from "../lib/axios";
import { ProductResponse, ProductVariantDetails } from "../types/api";

export const getAllProducts = async () => {
  const response = await apiRequest(() => api.get(GET_ALL_PRODUCTS));
  const mappedResponse: ProductResponse[] = response?.data
    .products as ProductResponse[];
  return mappedResponse;
};

export const getProductVariantDetails = async (slug: string) => {
  const response = await apiRequest(() =>
    api.get(`${GET_ALL_PRODUCTS}/${slug}`)
  );
  const mappedResponse: ProductVariantDetails = response?.data
    .product as ProductVariantDetails;
  return mappedResponse;
};
