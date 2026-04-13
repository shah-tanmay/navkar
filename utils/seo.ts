export function toOgImage(url: string, title?: string): string {
  if (!url || !url.includes("cloudinary.com")) return url;

  // 1. Get the base URL and Public ID (clean URL)
  // We want to handle both URLs with and without existing transformations/versions
  const parts = url.split("/upload/");
  if (parts.length < 2) return url;

  const baseUrl = parts[0];
  let publicIdWithVersion = parts[1];

  // Remove the version segment (e.g., v1741544256/) if present to keep URL clean
  const cleanPublicId = publicIdWithVersion.replace(/^v\d+\//, "");
  // We MUST use a version marker (like v1) if the public ID contains folders,
  // otherwise Cloudinary might misinterpret folders as transformations.
  const trulyCleanPublicId = `v1/${cleanPublicId}`;

  const headline = title
    ? encodeURIComponent(title)
        .replace(/%2C/g, "%252C") // Double-encode commas for Cloudinary text
        .replace(/%2F/g, "%252F") // Double-encode slashes
    : "Premium%20Curtains";

  const transforms = [
    "w_1200,h_630,c_fill,g_auto",
    "e_gradient_fade,y_-0.5,b_rgb:00000099",
    `l_text:Arial_42_bold:${headline},co_white,g_south_west,x_60,y_130,w_1000,c_fit`,
    "l_text:Arial_34_bold:BUY%20NOW%20%E2%86%92,co_rgb:D4AF37,g_south_west,x_60,y_65"
  ].join("/");

  return `${baseUrl}/upload/${transforms}/${trulyCleanPublicId}`;
}