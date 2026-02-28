/**
 * Compress an image file before uploading.
 * Returns a compressed Blob (JPEG/WebP) with reduced dimensions if needed.
 */
export async function compressImage(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<File> {
  // إلغاء الضغط نهائياً: إعادة الملف الأصلي كما هو
  return file;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
