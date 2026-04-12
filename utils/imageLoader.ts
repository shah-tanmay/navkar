/**
 * Optimized Cloudinary Loader for Next.js Image
 * Uses a robust replacement strategy to inject transformations.
 */
export const cloudinaryLoader = ({ src, width }: { src: string; width: number }) => {
  if (!src || !src.includes('res.cloudinary.com')) {
    return src;
  }

  // Simple and robust: replace /upload/ with optimized path
  // c_limit: resize only if larger than width
  // f_auto: best format
  // q_auto:best: higher quality automated compression
  // dpr_auto: serve appropriate resolution for high-density (Retina) screens
  return src.replace('/upload/', `/upload/f_auto,q_auto:best,w_${width},c_limit,dpr_auto/`);
};
