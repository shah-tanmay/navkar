/**
 * Transforms a Cloudinary URL to a 1200x630 OG-safe image.
 * This ensures the image fits the standard aspect ratio for social media previews.
 */
export function toOgImage(url: string, title?: string): string {
  if (!url || !url.includes("cloudinary.com")) return url;

  const headline = title
    ? encodeURIComponent(title).replace(/%2C/g, "%252C")
    : "Premium%20Curtains";

  const transforms = [
    "w_1200,h_630,c_fill,g_auto,f_auto,q_auto",
    "e_gradient_fade:symmetric_pad,x_0,y_-0.5,b_rgb:00000099",
    `l_text:Arial_42_bold:${headline},co_white,g_south_west,x_60,y_130,w_1000,c_fit`,
    "l_text:Arial_34_bold:BUY%20NOW%20%E2%86%92,co_rgb:D4AF37,g_south_west,x_60,y_65",
  ].join("/");


  return url.replace("/upload/", `/upload/${transforms}/`);
}