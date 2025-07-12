
import { useState, useCallback } from 'react';
import { UploadOptions } from '@/types/screenshot';

export const useImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const compressImage = useCallback(async (
    file: File,
    options: UploadOptions
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions if needed
        let { width, height } = img;
        const maxSize = 1920;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          // Add watermark if enabled
          ctx.drawImage(img, 0, 0, width, height);
          
          if (options.addWatermark && options.watermarkText) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '24px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(options.watermarkText, width - 20, height - 20);
          }

          const mimeType = `image/${options.format}`;
          const quality = options.compress ? options.quality / 100 : 1;
          const dataUrl = canvas.toDataURL(mimeType, quality);
          resolve(dataUrl);
        }
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  const extractExifData = useCallback(async (file: File) => {
    // Simple EXIF extraction (in real app, use exifr library)
    return {
      fileSize: file.size,
      mimeType: file.type,
      lastModified: new Date(file.lastModified),
      name: file.name
    };
  }, []);

  const processMultipleImages = useCallback(async (
    files: File[],
    options: UploadOptions,
    onProgress?: (progress: number) => void
  ): Promise<string[]> => {
    setIsProcessing(true);
    const results: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const processedImage = await compressImage(file, options);
      results.push(processedImage);
      
      if (onProgress) {
        onProgress((i + 1) / files.length * 100);
      }
    }

    setIsProcessing(false);
    return results;
  }, [compressImage]);

  return {
    isProcessing,
    compressImage,
    extractExifData,
    processMultipleImages
  };
};
