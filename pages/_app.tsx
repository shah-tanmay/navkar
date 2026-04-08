import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "../components/Layout";
import { CartProvider } from "../context/CartContext";
import { LoaderProvider } from "../context/LoaderContext";
import SEO from "../components/SEO";
import "../styles/global.css";
import { createGlobalStyle } from "styled-components";
import { useAuthErrorHandler } from "../lib/useAuthErrorHandler";

const GlobalStyle = createGlobalStyle`
  // Your other global styles here
`;

function AuthErrorHandler() {
  useAuthErrorHandler();
  return null;
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1234567890";
        ReactPixel.init(pixelId);
        ReactPixel.pageView();

        const handleRouteChange = () => {
          ReactPixel.pageView();
        };

        router.events.on("routeChangeComplete", handleRouteChange);

        return () => {
          router.events.off("routeChangeComplete", handleRouteChange);
        };
      });
  }, [router.events]);

  return (
    <LoaderProvider>
      <SEO />
      <CartProvider>
        <SessionProvider session={session}>
          <AuthErrorHandler />
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
