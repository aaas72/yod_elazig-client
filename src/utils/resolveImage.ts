const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api(\/v1)?\/?$/, '');
const UPLOAD_DIR = import.meta.env.VITE_UPLOAD_DIR || 'uploads';

const FALLBACK = '/imgs/HeroImgs/main-bg.jpg';

/**
 * Convert any image path to a fully-qualified URL the browser can load.
 * Handles:
 *  - Full URLs (http/https) → returned as-is
 *  - Server-relative paths (/uploads/...) → prepended with API origin
 *  - Local public paths (/imgs/...) → returned as-is
 *  - Empty/undefined → fallback image
 */
export interface ResolveImageOptions {
  folder?: string;        // e.g. 'gallery/photos' or 'news'
  fallback?: string;
}

export function resolveImage(img?: string | null, options?: string | ResolveImageOptions, maybeFallback?: string): string {
  // determine parameters
  let folder = 'gallery/photos';
  let fallback = FALLBACK;
  if (typeof options === 'string') {
    // if a second string arg is provided and a third also exists, treat second as folder and third as fallback
    if (typeof maybeFallback === 'string') {
      folder = options;
      fallback = maybeFallback;
    } else {
      // only two args; ambiguous: if options contains '/' assume it's folder, else treat as fallback
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

  // إذا كان فقط اسم الصورة بدون مسار (jpg/png/jpeg/gif/webp)
  if (!img.includes('/') && /\.(jpg|jpeg|png|gif|webp)$/i.test(img)) {
    img = `/uploads/${folder}/${img}`;
  }

  // إصلاح تكرار /api في بداية المسار
  if (img.startsWith(`/api/${UPLOAD_DIR}`)) {
    img = img.replace(`/api/${UPLOAD_DIR}`, `/${UPLOAD_DIR}`);
  }

  // إذا كان الرابط كامل
  if (img.startsWith('http://') || img.startsWith('https://')) return img;

  // مسار الصور من السيرفر
  if (img.startsWith(`/${UPLOAD_DIR}`) || img.startsWith(UPLOAD_DIR)) {
    const path = img.startsWith('/') ? img : `/${img}`;
    return `${API_URL}${path}`;
  }

  // مجلد public المحلي
  if (img.startsWith('/')) return img;

  return img;
}

/**
 * Process HTML content and resolve all image src attributes
 * that point to /uploads/... paths.
 */
export function resolveContentImages(html: string): string {
  if (!html) return html;
  const uploadDirPattern = new RegExp(`(<img\\s[^>]*src=["'])(\\/${UPLOAD_DIR}\\/[^"']+)(["'])`, 'gi');
  return html.replace(
    uploadDirPattern,
    (_, before, path, after) => `${before}${API_URL}${path}${after}`
  );
}
