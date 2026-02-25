const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api(\/v1)?\/?$/, '');

const FALLBACK = '/imgs/HeroImgs/main-bg.jpg';

/**
 * Convert any image path to a fully-qualified URL the browser can load.
 * Handles:
 *  - Full URLs (http/https) → returned as-is
 *  - Server-relative paths (/uploads/...) → prepended with API origin
 *  - Local public paths (/imgs/...) → returned as-is
 *  - Empty/undefined → fallback image
 */
export function resolveImage(img?: string | null, fallback = FALLBACK): string {
  if (!img || img.trim() === '') return fallback;

  // إصلاح تكرار /api في بداية المسار
  if (img.startsWith('/api/uploads')) {
    img = img.replace('/api/uploads', '/uploads');
  }

  // Already a full URL
  if (img.startsWith('http://') || img.startsWith('https://')) return img;

  // Server uploads path
  if (img.startsWith('/uploads') || img.startsWith('uploads')) {
    const path = img.startsWith('/') ? img : `/${img}`;
    return `${API_URL}${path}`;
  }

  // Local public folder
  if (img.startsWith('/')) return img;

  return img;
}

/**
 * Process HTML content and resolve all image src attributes
 * that point to /uploads/... paths.
 */
export function resolveContentImages(html: string): string {
  if (!html) return html;
  return html.replace(
    /(<img\s[^>]*src=["'])(\/uploads\/[^"']+)(["'])/gi,
    (_, before, path, after) => `${before}${API_URL}${path}${after}`
  );
}
