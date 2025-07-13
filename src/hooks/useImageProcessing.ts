
import { useState } from 'react';
import { generateShortLink } from '@/utils/config';

interface ProcessedImageResult {
  file: File;
  dataUrl: string;
  metadata: {
    size: number;
    format: string;
    dimensions: { width: number; height: number };
    hasExif: boolean;
  };
}

export const useImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = async (file: File): Promise<ProcessedImageResult> => {
    setIsProcessing(true);
    
    try {
      // Create data URL for preview
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      // Get image dimensions
      const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = dataUrl;
      });

      // Check for EXIF data (simple check)
      const hasExif = file.type === 'image/jpeg' && file.size > 50000; // Rough estimation

      return {
        file,
        dataUrl,
        metadata: {
          size: file.size,
          format: file.type,
          dimensions,
          hasExif
        }
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const compressImage = async (file: File, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920x1080 for web sharing)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback to original
          }
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const convertFormat = async (file: File, targetFormat: string): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const convertedFile = new File([blob], 
              file.name.replace(/\.[^/.]+$/, `.${targetFormat.split('/')[1]}`), {
              type: targetFormat,
              lastModified: Date.now()
            });
            resolve(convertedFile);
          } else {
            resolve(file);
          }
        }, targetFormat, 0.9);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const removeExifData = async (file: File): Promise<File> => {
    // Simple EXIF removal by re-drawing the image
    return compressImage(file, 1.0);
  };

  const generateShareableData = (imageId: string, title?: string) => {
    return {
      shortLink: generateShortLink(imageId),
      shareUrl: `${window.location.origin}/share/${imageId}`,
      qrCodeData: generateShortLink(imageId)
    };
  };

  return {
    processImage,
    compressImage,
    convertFormat,
    removeExifData,
    generateShareableData,
    isProcessing
  };
};
