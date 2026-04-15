import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";
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
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const saira = Saira({
  subsets: ["latin"],
  variable: "--font-saira",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const GlobalStyle = createGlobalStyle`
  :root {
    --font-outfit: ${outfit.style.fontFamily};
    --font-saira: ${saira.style.fontFamily};
  }
  
  html, body {
    margin: 0;
    padding: 0;
    font-family: var(--font-outfit), sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* Decisive override to force all components to use the Next.js self-hosted font */
  * {
    font-family: var(--font-outfit), sans-serif !important;
  }
`;

function AuthErrorHandler() {
  useAuthErrorHandler();
  return null;
}

// ── Meta Advanced Matching ──────────────────────────────────────────────────
// Hashes the logged-in user's email with SHA-256 (Web Crypto API, no library)
// and passes it to fbq('init') so Meta can match events to Facebook profiles.
// This lifts the match rate from ~44% (automatic only) toward 85-95%+.
async function sha256hex(plain: string): Promise<string> {
  const encoded = new TextEncoder().encode(plain.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function MetaAdvancedMatching({ pixelId }: { pixelId: string }) {
  const { data: session } = useSession();
  const email = (session?.user as any)?.email as string | undefined;

  useEffect(() => {
    if (!pixelId || !email) return;
    if (typeof window === "undefined" || !(window as any).fbq) return;

    sha256hex(email).then((hashedEmail) => {
      // Re-calling init with user data is the official Meta pattern for
      // manual advanced matching — it updates the identity context without
      // duplicating the pixel or resetting event queues.
      (window as any).fbq("init", pixelId, { em: hashedEmail });
    });
  }, [email, pixelId]);

  return null;
}
// ── End Meta Advanced Matching ──────────────────────────────────────────────

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "";
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";

  // Track Meta PageView on client-side navigation
  useEffect(() => {
    if (!pixelId) return;

    const trackPageView = () => {
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "PageView", {
          page_title:    document.title,
          page_location: window.location.href,
          page_path:     window.location.pathname,
        });
      }
    };

    router.events.on("routeChangeComplete", trackPageView);
    return () => {
      router.events.off("routeChangeComplete", trackPageView);
    };
  }, [router.events, pixelId]);

  // Track Google Ads page_view on client-side navigation
  useEffect(() => {
    if (!googleAdsId) return;

    const trackGtagPageView = () => {
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "page_view", {
          send_to:       googleAdsId,
          page_title:    document.title,
          page_location: window.location.href,
          page_path:     window.location.pathname,
        });
      }
    };

    router.events.on("routeChangeComplete", trackGtagPageView);
    return () => {
      router.events.off("routeChangeComplete", trackGtagPageView);
    };
  }, [router.events, googleAdsId]);

  return (
    <main className={`${outfit.variable} ${saira.variable}`}>
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
              strategy="afterInteractive"
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

        {/* Google Ads (gtag.js) — loads after hydration so it never blocks LCP */}
        {googleAdsId && (
          <>
            <Script
              id="gtag-loader"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleAdsId}');
                `,
              }}
            />
          </>
        )}

        <CartProvider>
          <SessionProvider session={session}>
            <AuthErrorHandler />
            <MetaAdvancedMatching pixelId={pixelId} />
            <GlobalStyle />
            <ToastContainer />
            <GoogleAnalytics trackPageViews strategy="lazyOnload" />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SessionProvider>
        </CartProvider>
      </LoaderProvider>
    </main>
  );
}

export default MyApp;
