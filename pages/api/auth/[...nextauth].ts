import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import httpRequest from "../../../common/HttpRequest";

type credentialData = {
  email: string;
  password: string;
};

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {},
      authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const form = {
          email: email,
          password: password,
        };

        let response = axios
          .post(`${process.env.NEXT_PUBLIC_BACK_END_URL}/api/login`, form)
          .then((response) => {
            const result = response.data;
            if (result.status == 200) {
              return result.data.user_data;
            }
          });

        return response;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    // newUser: "/register",
  },
};

export default NextAuth(authOptions);
