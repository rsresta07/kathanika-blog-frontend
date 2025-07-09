import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      slug?: string;
      role?: string;
    };
  }

  interface Account {
    backendToken?: string;
    slug?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    slug?: string;
    role?: string;
  }
}
