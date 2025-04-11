// utils/loader.ts
type LoaderFunctions = {
  showLoader: () => void;
  hideLoader: () => void;
};

let loaderFunctions: LoaderFunctions | null = null;

export const setLoaderFunctions = (functions: LoaderFunctions) => {
  loaderFunctions = functions;
};

export const getLoaderFunctions = (): LoaderFunctions => {
  if (!loaderFunctions) {
    console.warn("Loader functions not initialized yet. Retrying...");
    throw new Error(
      "Loader functions not initialized! Make sure LoaderProvider is wrapped properly."
    );
  }
  return loaderFunctions;
};
