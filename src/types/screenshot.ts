
export interface Screenshot {
  id: string;
  userId?: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  originalFilename?: string;
  filePath: string;
  fileSize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  shortLink?: string;
  qrCodePath?: string;
  passwordHash?: string;
  expiresAt?: Date;
  viewCount: number;
  maxViews?: number;
  watermarkEnabled: boolean;
  watermarkText?: string;
  isPublic: boolean;
  timestamp: Date;
  dataUrl: string; // For local storage compatibility
  tags?: Tag[];
  versions?: ImageVersion[];
  exifData?: ExifData;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface ImageVersion {
  id: string;
  screenshotId: string;
  versionNumber: number;
  filePath: string;
  editDescription?: string;
  createdAt: Date;
}

export interface ExifData {
  id: string;
  screenshotId: string;
  cameraMake?: string;
  cameraModel?: string;
  iso?: number;
  aperture?: string;
  shutterSpeed?: string;
  focalLength?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  dateTaken?: Date;
  rawExifJson?: string;
}

export interface UploadOptions {
  compress: boolean;
  quality: number;
  format: 'png' | 'jpg' | 'webp' | 'avif';
  removeExif: boolean;
  addWatermark: boolean;
  watermarkText?: string;
}

export interface ShareOptions {
  password?: string;
  expiryHours?: number;
  maxViews?: number;
  enableAnalytics: boolean;
}
