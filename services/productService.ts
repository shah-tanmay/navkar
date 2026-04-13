import { GET_ALL_PRODUCTS } from "../constants/endpoint";
import api, { apiRequest } from "../lib/axios";
import { ProductResponse, ProductVariantDetails } from "../types/api";

export const getAllProducts = async () => {
  const response = await apiRequest(() => api.get(GET_ALL_PRODUCTS));
  const stitching_fee = response?.data.stitching_fee || 0;
  const products: any[] = response?.data.products || [];
  
  const mappedResponse: ProductResponse[] = products.map(p => ({
    ...p,
    stitching_fee
  }));
  
  return mappedResponse;
};

export const getProductVariantDetails = async (slug: string) => {
  const response = await apiRequest(() =>
    api.get(`${GET_ALL_PRODUCTS}/${slug}`)
  );
  const product = response?.data.product;
  if (product) {
    product.stitching_fee = response?.data.stitching_fee;
    product.delivery_timeline = response?.data.delivery_timeline;
  }
  return product as ProductVariantDetails;
};
