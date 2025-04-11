import { BASE_ADDRESS_URL } from "../constants/endpoint";
import api, { apiRequest } from "../lib/axios";
import { Address } from "../types/api";

export const getAddresses = async (): Promise<Address[]> => {
  const response = await apiRequest(() => api.get(`${BASE_ADDRESS_URL}`));
  const orderResponse: Address[] = response?.data.addresses as Address[];
  return orderResponse;
};

export const updateAddress = async ({
  street,
  flatHouseNo,
  landmark,
  state,
  city,
  zip,
  type,
  phone,
  addressId,
}: {
  street: string;
  flatHouseNo: string;
  landmark?: string;
  state: string;
  city: string;
  zip: string;
  type: string;
  phone: string;
  addressId: string;
}) => {
  const streetAddress = `${flatHouseNo}::${street}`;
  const address = {
    street: streetAddress,
    landmark,
    state,
    city,
    postal_code: zip,
    type,
    phone,
  };
  const response = await apiRequest(() =>
    api.put(`${BASE_ADDRESS_URL}/${addressId}`, address)
  );
  const addressResponse: Address = response?.data.address as Address;
  return addressResponse;
};

export const postAddress = async ({
  street,
  flatHouseNo,
  landmark,
  state,
  city,
  zip,
  type,
  phone,
}: {
  street: string;
  flatHouseNo: string;
  landmark?: string;
  state: string;
  city: string;
  zip: string;
  type: string;
  phone: string;
}): Promise<Address> => {
  const streetAddress = `${flatHouseNo}::${street}`;
  const address = {
    street: streetAddress,
    landmark,
    state,
    city,
    postal_code: zip,
    type,
    phone,
  };
  const response = await apiRequest(() =>
    api.post(`${BASE_ADDRESS_URL}`, address)
  );
  const addressResponse: Address = response?.data.address as Address;
  return addressResponse;
};
