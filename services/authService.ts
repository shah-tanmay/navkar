import {
  BASE_AUTH_URL,
  GOOGLE_OAUTH_LOGIN_URL,
  REGISTER_USER_URL,
} from "../constants/endpoint";
import api, { apiRequest } from "../lib/axios";
import { RegisterLoginResponse, UserObject } from "../types/api";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterLoginResponse> => {
  const response = await apiRequest(() => api.post(REGISTER_USER_URL));
  const mappedResponse: RegisterLoginResponse = { ...response?.data };
  return mappedResponse;
};

export const googleAuthLogin = async (
  email: string,
  name: string,
  token: string
): Promise<RegisterLoginResponse> => {
  const response = await apiRequest(() =>
    api.post(
      GOOGLE_OAUTH_LOGIN_URL,
      { email, name },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
  );
  const mappedResponse: RegisterLoginResponse = { ...response?.data };
  return mappedResponse;
};

export const updateProfile = async (data: {
  name?: string;
  phone?: string;
}): Promise<UserObject> => {
  const response = await apiRequest(() => api.put(`${BASE_AUTH_URL}/profile`, data));
  return response?.data.user;
};

export const updatePassword = async (data: {
  currentPassword?: string;
  newPassword?: string;
}): Promise<{ message: string }> => {
  const response = await apiRequest(() =>
    api.put(`${BASE_AUTH_URL}/change-password`, data)
  );
  return response?.data;
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<string> => {
  const response = await apiRequest(() =>
    api.post(`${BASE_AUTH_URL}/refresh-token`, { refreshToken })
  );
  const accessToken = response?.data.authToken;
  return accessToken;
};
