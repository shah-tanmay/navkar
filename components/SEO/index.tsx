import Head from "next/head";
import React from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "product";
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  type = "website",
}) => {
  const siteName = "Navkar";
  const defaultTitle = "Navkar | Exquisite Curtains, Drapes & Home Decor";
  const defaultDescription =
    "Discover Navkar's curated collection of premium curtains and bespoke drapes. Handcrafted with passion, our artisanal home decor brings timeless elegance to every room.";
  const defaultImage = "https://navkarcurtains.com/og-image-main.jpg";
  const siteUrl = "https://navkarcurtains.com";

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Head>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEO;
