import { useSession, signOut } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    token: session?.backendToken ?? null,
    loading: status === "loading",
    loggedIn: !!session?.user,
    logout: () => signOut({ callbackUrl: "/" }),
  };
};
