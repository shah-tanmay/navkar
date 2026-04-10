import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
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

  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "";

  useEffect(() => {
    if (!pixelId) return;

    const trackPageView = () => {
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "PageView");
      }
    };

    router.events.on("routeChangeComplete", trackPageView);
    return () => {
      router.events.off("routeChangeComplete", trackPageView);
    };
  }, [router.events, pixelId]);

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

      {/* Facebook Pixel — deferred until browser is idle, no impact on LCP/TBT */}
      {pixelId && (
        <>
          <Script
            id="fb-pixel"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

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
