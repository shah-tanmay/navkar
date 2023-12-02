import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <title>Navkar</title>
          <meta
            name="description"
            content="Best mattresses shop offering premium quality mattresses. Explore our collection now!"
          />
          <meta name="keywords" content="mattresses, bedding, sleep, comfort" />
          {/* Other necessary meta tags */}
          <link rel="canonical" href="https://navker-test.netlify.com/" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
