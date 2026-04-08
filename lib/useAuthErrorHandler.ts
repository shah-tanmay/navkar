import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";

export function useAuthErrorHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      toast.error("Session expired. Please log in again.");
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);
}
