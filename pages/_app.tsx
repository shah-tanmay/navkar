import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createGlobalStyle } from "styled-components";
import { Layout } from "../components/Layout";
import { CartProvider } from "../context/CartContext";
import { LoaderProvider } from "../context/LoaderContext";
import SEO from "../components/SEO";
import "../styles/global.css";
import { useAuthErrorHandler } from "../lib/useAuthErrorHandler";
import { Outfit, Saira } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const saira = Saira({
  subsets: ["latin"],
  variable: "--font-saira",
  display: "swap",
});

const GlobalStyle = createGlobalStyle`
  :root {
    --font-outfit: ${outfit.style.fontFamily};
    --font-saira: ${saira.style.fontFamily};
  }
  
  body {
    font-family: var(--font-outfit), sans-serif;
  }
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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
