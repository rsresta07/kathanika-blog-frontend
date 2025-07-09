import { useSession, signOut } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  // Debug: log the session to see what's available
  console.log("Session data:", session);
  console.log("User object:", session?.user);
  console.log("Backend token:", session?.backendToken);

  return {
    user: session?.user ?? null,
    token: session?.backendToken ?? null,
    loading: status === "loading",
    loggedIn: !!session?.user,
    logout: () => signOut({ callbackUrl: "/" }),
  };
};
