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
  const siteName = "Navkar Curtains";
  const defaultTitle = "Navkar | Exquisite Artisanal Curtains & Drapes";
  const defaultDescription =
    "Elevate your living space with Navkar's handcrafted curtains and bespoke drapes. Premium fabrics, master tailoring, and timeless elegance for every window.";
  const siteUrl = "https://navkar.shop";
  const defaultImage = `${siteUrl}/images/logo.png`;

  // Fallback logic
  const seoTitle = (title && title.trim().length > 0) ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = (description && description.trim().length > 0) ? description : defaultDescription;
  
  // Robust image fallback
  let seoImage = defaultImage;
  if (image && image.trim().length > 0) {
    seoImage = image.startsWith("http") ? image : `${siteUrl}${image}`;
  }

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
      <meta property="og:image:secure_url" content={seoImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:domain" content="navkar.shop" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEO;
