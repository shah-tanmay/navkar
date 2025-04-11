import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { setLoaderFunctions } from "../utils/loader";

type LoaderContextType = {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};

export const LoaderContext = createContext<LoaderContextType | undefined>(
  undefined
);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [loadingCount, setLoadingCount] = useState<number>(0);

  const showLoader = () => setLoadingCount((prev) => prev + 1);
  const hideLoader = () => setLoadingCount((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    setLoaderFunctions({ showLoader, hideLoader });
  }, [showLoader, hideLoader]); // Include in dependency array

  return (
    <LoaderContext.Provider
      value={{ isLoading: loadingCount > 0, showLoader, hideLoader }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = (): LoaderContextType => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};
