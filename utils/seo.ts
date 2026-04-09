/**
 * Transforms a Cloudinary URL to a 1200x630 OG-safe image with optional 
 * Headline (Product Name) and CTA (Shop Now) overlays.
 */
export function toOgImage(url: string, title?: string): string {
  if (!url || !url.includes("cloudinary.com")) return url;
  
  // Base layout: 1200x630, high quality, auto context focus
  let transform = "w_1200,h_630,c_fill,g_auto,f_auto,q_auto:best";
  
  if (title) {
    // Layer 1: Dark translucent bar for text readability at the bottom
    // We use a solid black box with 40% opacity
    transform += "/c_scale,g_south,h_160,l_solid:black,o_40,w_1200";
    
    // Layer 2: Headline (Product Name)
    // We clean the title to ensure it's URL safe for Cloudinary's text layer
    const cleanTitle = title.replace(/[^\w\s-]/g, '').slice(0, 45);
    const encodedTitle = encodeURIComponent(cleanTitle);
    transform += `/co_white,g_south_west,l_text:Arial_48_bold:${encodedTitle},x_50,y_65`;
    
    // Layer 3: CTA Button (Buy Now) - Styled to match site brand colors
    // D4AF37 is the Gold background, 111111 is the text color
    transform += "/co_rgb:111111,g_south_east,l_text:Arial_36_bold:  BUY NOW  ,x_50,y_72,b_rgb:D4AF37,r_12";
  }
  
  return url.replace("/upload/", `/upload/${transform}/`);
}
