/**
 * Transforms a Cloudinary URL to a 1200x630 OG-safe image.
 * This ensures the image fits the standard aspect ratio for social media previews.
 */
export function toOgImage(url: string, title?: string): string {
  if (!url || !url.includes("cloudinary.com")) return url;
  
  // Basic robust transformation: 1200x630 with auto-cropping and auto-quality
  const transform = "w_1200,h_630,c_fill,g_auto,f_auto,q_auto";
  
  return url.replace("/upload/", `/upload/${transform}/`);
}
