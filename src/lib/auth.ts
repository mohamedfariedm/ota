import Credentials from "next-auth/providers/credentials";
import { loginUser } from "@/actions";
import { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      first_name?: string;
      last_name?: string;
      firstName?: string;
      lastName?: string;
      image?: string;
      // add other minimal user fields you need here
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      //@ts-ignore
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const result = await loginUser("Credentials", { email, password });
        console.log("auth-authorize", result);
        if (result.success && result.user) {
          // Return only minimal user info here
          const { id, email, first_name, last_name } = result.user;
          return { id, email, first_name, last_name };
        } else {
          console.log("auth-failed");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store only minimal user info in the token
        token.user = {
          id: user.id,
          email: user.email,
          //@ts-ignore
          first_name: user.first_name,
          //@ts-ignore
          last_name: user.last_name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        // Map minimal token user data to session user
        session.user = token.user as any;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV !== "production",
};
