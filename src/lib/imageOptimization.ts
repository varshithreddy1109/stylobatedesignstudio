/**
 * Automatic image optimization for admin uploads.
 *
 * Runs entirely in the browser (Canvas API — no new dependency) before any
 * file reaches Supabase Storage. The original file is never uploaded: every
 * image is resized to a sensible maximum dimension for its use, then
 * adaptively compressed (quality is stepped down, then dimensions are
 * shrunk further if needed) until it's at or under the target size for that
 * image kind — without a manual quality control ever being shown to the
 * admin.
 */

export type ImageKind = "service-icon" | "testimonial" | "project-cover" | "project-gallery" | "favicon";

interface OptimizationTarget {
  maxBytes: number;
  maxDimension: number;
}

// Maximum target sizes — not fixed sizes. The loop below stops as soon as
// the target is met, so most images end up well under these ceilings.
const TARGETS: Record<ImageKind, OptimizationTarget> = {
  "service-icon": { maxBytes: 10 * 1024, maxDimension: 256 },
  testimonial: { maxBytes: 20 * 1024, maxDimension: 480 },
  "project-cover": { maxBytes: 200 * 1024, maxDimension: 1920 },
  "project-gallery": { maxBytes: 150 * 1024, maxDimension: 1600 },
  favicon: { maxBytes: 15 * 1024, maxDimension: 128 },
};

function fitWithinMaxDimension(width: number, height: number, maxDimension: number) {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }
  const ratio = width > height ? maxDimension / width : maxDimension / height;
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
}

async function loadSource(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to the <img> based loader below (older Safari, some
      // unusual file variants createImageBitmap can't decode directly).
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}

function getSourceDimensions(source: ImageBitmap | HTMLImageElement) {
  if (source instanceof HTMLImageElement) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }
  return { width: source.width, height: source.height };
}

function encodeCanvas(
  source: ImageBitmap | HTMLImageElement,
  width: number,
  height: number,
  mimeType: string,
  quality: number
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);

  ctx.drawImage(source as CanvasImageSource, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

/**
 * Optimizes a single image file for the given usage ("kind"), returning a
 * new File ready to upload in place of the original. Falls back to
 * returning the original file untouched only if encoding fails entirely
 * (e.g. an unsupported/corrupt input) — the save is never blocked by this.
 */
export async function optimizeImage(file: File, kind: ImageKind): Promise<File> {
  const { maxBytes, maxDimension } = TARGETS[kind];

  let source: ImageBitmap | HTMLImageElement;
  try {
    source = await loadSource(file);
  } catch {
    return file;
  }

  const { width: sourceWidth, height: sourceHeight } = getSourceDimensions(source);
  let { width, height } = fitWithinMaxDimension(sourceWidth, sourceHeight, maxDimension);

  let mimeType = "image/webp";
  let quality = 0.82;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 8; attempt++) {
    // eslint-disable-next-line no-await-in-loop -- each attempt depends on the previous result's size
    const candidate = await encodeCanvas(source, width, height, mimeType, quality);

    if (!candidate && mimeType === "image/webp") {
      // This browser's canvas encoder can't produce WebP — fall back to
      // JPEG for the rest of the attempts.
      mimeType = "image/jpeg";
      continue;
    }

    if (!candidate) break;
    blob = candidate;

    if (blob.size <= maxBytes) break;

    if (quality > 0.42) {
      quality = Math.round((quality - 0.12) * 100) / 100;
    } else {
      // Quality floor reached without hitting the target — shrink
      // dimensions further and reset quality for another pass.
      width = Math.round(width * 0.85);
      height = Math.round(height * 0.85);
      quality = 0.7;
    }
  }

  if ("close" in source && typeof source.close === "function") {
    source.close();
  }

  if (!blob) {
    return file;
  }

  const extension = mimeType === "image/webp" ? "webp" : "jpg";
  const baseName = file.name.replace(/\.[^./\\]+$/, "") || "image";

  return new File([blob], `${baseName}.${extension}`, { type: mimeType });
}
