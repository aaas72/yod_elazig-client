import api from '@/lib/api';
import { compressImage, formatFileSize } from '@/utils/imageCompressor';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

const MAX_SIZE = 1 * 1024 * 1024; // 1 MB

export const uploadService = {
  /**
   * Upload a single image — compresses it first, validates size, then sends as multipart/form-data
   */
  uploadImage: async (
    file: File,
    options?: { maxWidth?: number; maxHeight?: number; quality?: number; folder?: string }
  ): Promise<UploadResult> => {
    const compressed = await compressImage(file, options);

    if (compressed.size > MAX_SIZE) {
      throw new Error(`حجم الصورة (${formatFileSize(compressed.size)}) يتجاوز الحد المسموح (1 MB)`);
    }

    const formData = new FormData();
    formData.append('image', compressed);
    if (options?.folder) {
      formData.append('folder', options.folder);
    }

    const { data } = await api.post<{ success: boolean; data: UploadResult }>(
      '/v1/upload/image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 }
    );
    return data.data;
  },

  /**
   * Upload multiple images
   */
  uploadImages: async (
    files: File[],
    options?: { maxWidth?: number; maxHeight?: number; quality?: number; folder?: string }
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    for (const file of files) {
      const result = await uploadService.uploadImage(file, options);
      results.push(result);
    }
    return results;
  },
};
