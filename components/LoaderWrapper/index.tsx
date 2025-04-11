import { ReactNode } from "react";
import { Loader } from "../Loader";

export const LoaderWrapper = ({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) => {
  if (loading) {
    return <Loader />;
  }
  return <>{children}</>;
};
