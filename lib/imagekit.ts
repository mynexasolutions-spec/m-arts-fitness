import ImageKit from "imagekit";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/2adr187f7j";
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";

// Server-side ImageKit instance (for uploading, deleting, and auth)
let imagekitServerInstance: ImageKit | null = null;

export function getImageKitServer(): ImageKit {
  if (!imagekitServerInstance) {
    if (!publicKey || !privateKey || !urlEndpoint) {
      console.warn("[ImageKit] Missing environment variables for ImageKit server SDK.");
    }
    imagekitServerInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  }
  return imagekitServerInstance;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  aspectRatio?: string;
  cropMode?: "maintain_ratio" | "force" | "at_least" | "at_max";
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  blur?: number;
}

/**
 * Returns an optimized ImageKit URL with optional real-time transformations.
 * If the path is a local file or external URL, it formats or returns it appropriately.
 */
export function getImageKitUrl(
  src: string,
  transforms?: ImageTransformOptions
): string {
  if (!src) return "";

  // If already an absolute non-ImageKit URL (e.g. external CDN), return as-is
  if (src.startsWith("http://") || (src.startsWith("https://") && !src.includes("ik.imagekit.io"))) {
    return src;
  }

  const cleanEndpoint = urlEndpoint.replace(/\/+$/, "");
  let relativePath = src;

  // Extract relative path if already full ImageKit URL
  if (src.startsWith("http")) {
    relativePath = src.replace(cleanEndpoint, "");
  }

  // Ensure relativePath starts with single slash
  if (!relativePath.startsWith("/")) {
    relativePath = `/${relativePath}`;
  }

  if (!transforms) {
    return `${cleanEndpoint}${relativePath}`;
  }

  const transformParts: string[] = [];
  if (transforms.width) transformParts.push(`w-${transforms.width}`);
  if (transforms.height) transformParts.push(`h-${transforms.height}`);
  if (transforms.quality) transformParts.push(`q-${transforms.quality}`);
  if (transforms.aspectRatio) transformParts.push(`ar-${transforms.aspectRatio}`);
  if (transforms.cropMode) transformParts.push(`cm-${transforms.cropMode}`);
  if (transforms.format) transformParts.push(`f-${transforms.format}`);
  if (transforms.blur) transformParts.push(`bl-${transforms.blur}`);

  if (transformParts.length === 0) {
    return `${cleanEndpoint}${relativePath}`;
  }

  const trString = `tr:${transformParts.join(",")}`;
  return `${cleanEndpoint}/${trString}${relativePath}`;
}

export default getImageKitServer;

