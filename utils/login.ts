import { getSession } from "next-auth/react";

export const isUserloggedIn = async () => {
  const session = await getSession();
  return session && session?.token?.accessToken;
};
