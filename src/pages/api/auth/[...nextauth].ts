import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import type { NextApiRequest, NextApiResponse } from "next";

declare module "next-auth" {
  interface User {
    backendToken?: string;
    slug?: string;
    role?: string;
  }

  interface Session {
    user: {
      backendToken?: string;
      slug?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    backendToken?: string;
    slug?: string;
    role?: string;
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
      }),
      FacebookProvider({
        clientId: process.env.FB_ID!,
        clientSecret: process.env.FB_SECRET!,
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async signIn({ user, account }) {
        if (!account) return false;

        try {
          console.log("=== SignIn Callback ===");
          console.log("User:", user);
          console.log("Account:", account);

          const requestBody = {
            provider: account.provider,
            providerId: account.providerAccountId,
            email: user.email,
            fullName: user.name,
            avatar: user.image,
          };

          console.log("Request body:", requestBody);

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
            }
          );

          console.log("Response status:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              "OAuth backend request failed:",
              response.status,
              errorText
            );
            return false;
          }

          const backendData = await response.json();
          console.log("Backend response:", backendData);

          // Store backend data on account for use in jwt callback
          user.backendToken = backendData.token;
          user.slug = backendData.slug;
          user.role = backendData.role;

          console.log("Account after storing backend data:", account);
          return user;

        } catch (error) {
          console.error("Error during OAuth sign in:", error);
          return false;
        }
      },

      async jwt({ token, account, user }) {
        console.log("=== JWT Callback ===");
        console.log("Token before:", token);
        console.log("Account:", account);
        console.log("User:", user);

        if (account && user) {
          // First sign in
          token.backendToken = user.backendToken;
          token.slug = user.slug;
          token.role = user.role;
        }

        // For subsequent calls, token will have these properties, so keep them as is
        return token;
      },

      async session({ session, token }) {
        console.log("=== Session Callback ===");
        console.log("Session before:", session);
        console.log("Token:", token);

        // Add backend data to session
        if (token.backendToken) {
          session.user.backendToken = token.backendToken as string;
        }
        if (token.slug) {
          session.user.slug = token.slug as string;
        }
        if (token.role) {
          session.user.role = token.role as string;
        }

        console.log("Session after:", session);
        return session;
      },
    },
    pages: {
      error: "/auth/error",
    },
    debug: true, // Enable debug mode
  });
}
