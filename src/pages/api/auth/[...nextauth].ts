import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import type { NextApiRequest, NextApiResponse } from "next";

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
    secret: process.env.NEXTAUTH_SECRET, // Add this
    callbacks: {
      async signIn({ user, account }) {
        if (!account) return false;

        try {
          console.log("Attempting OAuth sign in for:", user.email); // Add debugging

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                provider: account.provider,
                providerId: account.providerAccountId,
                email: user.email,
                fullName: user.name,
                avatar: user.image,
              }),
            }
          );

          if (!response.ok) {
            console.error(
              "OAuth backend request failed:",
              response.status,
              await response.text()
            );
            return false;
          }

          const { token, slug, role } = await response.json();

          account.backendToken = token;
          account.slug = slug;
          account.role = role;

          return true;
        } catch (error) {
          console.error("Error during OAuth sign in:", error);
          return false;
        }
      },
      // ... rest of your callbacks
    },
    pages: {
      error: "/auth/error",
    },
    debug: true, // Add this for debugging
  });
}
