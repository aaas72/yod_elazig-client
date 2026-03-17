import api from '@/lib/api-client';
import { compressImage, formatFileSize } from '@/utils/imageCompressor';
import { performPreflightTokenCheck } from '@/lib/api-client';

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
    // 1. Perform pre-flight token check before compression and upload
    await performPreflightTokenCheck();

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
      '/upload/image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 }
    );
    return data.data;
  },

  /**
   * Upload multiple images in parallel
   */
  uploadImages: async (
    files: File[],
    options?: { maxWidth?: number; maxHeight?: number; quality?: number; folder?: string }
  ): Promise<UploadResult[]> => {
    // Process all uploads in parallel
    const uploadPromises = files.map(file => uploadService.uploadImage(file, options));

    // Wait for all to complete
    return Promise.all(uploadPromises);
  },
};
