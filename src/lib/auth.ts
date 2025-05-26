import Credentials from "next-auth/providers/credentials";
import { loginUser } from "@/actions";
import { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
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
          const { id, email} = result.user;
          return { id, email};
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
