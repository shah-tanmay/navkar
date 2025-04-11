import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Loader } from "../Loader";
import { toast } from "react-toastify";
import _ from "lodash";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.warn(`Please Login`);
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loader />;
  }

  return <>{session && children}</>;
};

export default ProtectedRoute;
