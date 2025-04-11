import _, { uniqueId } from "lodash";
import NextAuth, { AuthOptions, RequestInternal, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { googleAuthLogin, registerUser } from "../../../services/authService";
import { ServerToken, UserObject } from "../../../types/api";

const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 40000,
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      id: "username-login",
      name: "Credentials",
      credentials: {
        name: { label: "Username", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
        email: { label: "Email", type: "email", required: true },
      },
      async authorize(
        credentials: Record<"name" | "email" | "password", string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ) {
        const name = _.get(credentials, "name");
        const email = _.get(credentials, "email");
        const password = _.get(credentials, "password");
        if (!name || !email || !password) {
          throw new Error("All the fields are required");
        }
        const apiResponse = await registerUser(name, email, password);
        const userData: User = {
          id: _.uniqueId(),
          user: _.get(apiResponse, "user"),
          token: _.get(apiResponse, "tokens"),
        };
        if (!userData) return null;
        return userData;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, account, user, profile }) {
      if (account && profile) {
        if (!account.id_token || !user.email || !user.name) {
          throw new Error("Google Auth Failed");
        }
        const response = await googleAuthLogin(
          user.email,
          user.name,
          account.id_token
        );
        token.user = response.user;
        token.token = response.tokens;
        token.id_token = account.id_token;
      }
      if (user) {
        // token.user = _.get(user, "user");
        // token.token = _.get(user, "token");
      }
      //user already logged in but some issues with logout/login
      if (token && !token.token?.accessToken) {
        if (!token.id_token || !token.name || !token.email) {
          throw new Error("Login Failed");
        }
        const response = await googleAuthLogin(
          token.email,
          token.name,
          token.id_token as string
        );
        token.user = response.user;
        token.token = response.tokens;
      }
      return token;
    },
    async session({ session, user, token }) {
      if (token) {
        session.user = token.user as UserObject;
        session.token = token.token as ServerToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
export default NextAuth(authOptions);
