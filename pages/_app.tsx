import "../styles/global.css";
import type { AppProps } from "next/app";
import { Fragment } from "react";
import { GoogleAnalytics } from "nextjs-google-analytics";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <GoogleAnalytics trackPageViews strategy="lazyOnload" />
      <Component {...pageProps} />
    </Fragment>
  );
}

export default MyApp;
