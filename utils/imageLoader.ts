/**
 * Optimized Cloudinary Loader for Next.js Image
 * Uses a robust replacement strategy to inject transformations.
 */
export const cloudinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  if (!src) return "";
  
  if (!src.includes('res.cloudinary.com')) {
    return src;
  }

  const parts = src.split('/upload/');
  if (parts.length < 2) return src;

  const baseUrl = parts[0];
  const rest = parts[1];
  
  const restParts = rest.split('/');
  const publicId = restParts[restParts.length - 1];
  const folders = restParts.slice(0, restParts.length - 1).join('/');

  let qualityString = 'q_auto';
  if (quality) {
    if (quality <= 50) {
      qualityString = 'q_auto:low';
    } else if (quality <= 75) {
      qualityString = 'q_auto:eco';
    } else {
      qualityString = `q_${quality}`;
    }
  }

  const transformations = [
    'f_auto',
    qualityString,
    `w_${width}`,
    'c_limit'
  ].join(',');

  const path = folders ? `${folders}/${publicId}` : publicId;
  
  // Cloudinary sometimes misinterprets folder names as transformations if no version is present.
  // We ensure a version prefix (v1) exists if there are folders.
  const hasVersion = path.startsWith('v') && /v\d+/.test(path.split('/')[0]);
  const versionedPath = (folders && !hasVersion) ? `v1/${path}` : path;

  return `${baseUrl}/upload/${transformations}/${versionedPath}`;
};
