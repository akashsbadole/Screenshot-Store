
// Configuration utility for dynamic domain detection
export const getBaseUrl = (): string => {
  // In production, use the current domain
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for server-side or development
  return 'https://screenshot-store.com';
};

export const generateShortLink = (imageId: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/s/${imageId}`;
};

export const generateShareableUrl = (imageId: string, title?: string): string => {
  const baseUrl = getBaseUrl();
  const slug = title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : imageId;
  return `${baseUrl}/share/${slug}-${imageId}`;
};

export const config = {
  app: {
    name: 'Screenshot Store',
    description: 'Advanced screen capture and sharing platform',
    version: '1.0.0'
  },
  features: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    compressionQuality: 0.8,
    maxImages: 100
  },
  sharing: {
    defaultExpiry: 30, // days
    maxViews: 1000,
    enableAnalytics: true
  }
};
