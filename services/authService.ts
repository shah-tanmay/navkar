import {
  GOOGLE_OAUTH_LOGIN_URL,
  REGISTER_USER_URL,
} from "../constants/endpoint";
import api, { apiRequest } from "../lib/axios";
import { RegisterLoginResponse } from "../types/api";

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
