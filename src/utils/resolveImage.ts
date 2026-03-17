// In production, uploads are served from the same origin (via nginx)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? (typeof window !== 'undefined' ? '' : 'http://localhost:5000');
const UPLOAD_DIR = process.env.NEXT_PUBLIC_UPLOAD_DIR || 'uploads';

const FALLBACK = '/imgs/HeroImgs/main-bg.jpg';

/**
 * Convert any image path to a fully-qualified URL the browser can load.
 */
export interface ResolveImageOptions {
  folder?: string;
  fallback?: string;
}

export function resolveImage(img?: string | null, options?: string | ResolveImageOptions, maybeFallback?: string): string {
  let folder = 'gallery/photos';
  let fallback = FALLBACK;

  if (typeof options === 'string') {
    if (typeof maybeFallback === 'string') {
      folder = options;
      fallback = maybeFallback;
    } else {
      if (options.includes('/')) {
        folder = options;
      } else {
        fallback = options;
      }
    }
  } else if (options && typeof options === 'object') {
    if (options.folder) folder = options.folder;
    if (options.fallback) fallback = options.fallback;
  }

  if (!img || img.trim() === '') return fallback;

  // If just image name without path
  if (!img.includes('/') && /\.(jpg|jpeg|png|gif|webp)$/i.test(img)) {
    img = `/uploads/${folder}/${img}`;
  }

  // Fix double /api in path
  if (img.startsWith(`/api/${UPLOAD_DIR}`)) {
    img = img.replace(`/api/${UPLOAD_DIR}`, `/${UPLOAD_DIR}`);
  }

  // Normalize localhost URLs → extract path and use production API_URL
  if (img.startsWith('http://localhost') || img.startsWith('http://127.0.0.1')) {
    try {
      img = new URL(img).pathname;
    } catch {}
  }

  // Full URL
  if (img.startsWith('http://') || img.startsWith('https://')) return img;

  // Server upload path
  if (img.startsWith(`/${UPLOAD_DIR}`) || img.startsWith(UPLOAD_DIR)) {
    const path = img.startsWith('/') ? img : `/${img}`;
    return `${API_URL}${path}`;
  }

  // Local public path
  if (img.startsWith('/')) return img;

  return img;
}

/**
 * Process HTML content and resolve all image src attributes
 */
export function resolveContentImages(html: string): string {
  if (!html) return html;
  const uploadDirPattern = new RegExp(`(<img\\s[^>]*src=["'])(\\/${UPLOAD_DIR}\\/[^"']+)(["'])`, 'gi');
  return html.replace(
    uploadDirPattern,
    (_, before, path, after) => `${before}${API_URL}${path}${after}`
  );
}
