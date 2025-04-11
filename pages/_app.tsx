import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "../components/Layout";
import { CartProvider } from "../context/CartContext";
import { LoaderProvider } from "../context/LoaderContext";
import "../styles/global.css";
import { createGlobalStyle } from "styled-components";
import { GlobalModalStyles } from "../components/AddressModal/styles";

const GlobalStyle = createGlobalStyle`
  ${GlobalModalStyles}
  // Your other global styles here
`;

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <LoaderProvider>
      <CartProvider>
        <SessionProvider session={session}>
          <GlobalStyle />
          <ToastContainer />
          <GoogleAnalytics trackPageViews strategy="lazyOnload" />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </CartProvider>
    </LoaderProvider>
  );
}

export default MyApp;
