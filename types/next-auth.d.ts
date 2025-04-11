// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { ServerToken, UserObject } from "./api";

declare module "next-auth" {
  interface Session {
    user: UserObject;
    token?: ServerToken;
  }

  interface User {
    user: UserObject;
    token: ServerToken;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token?: ServerToken;
  }
}
