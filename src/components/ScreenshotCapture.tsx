
import { useState, useCallback, useRef } from 'react';
import { Camera, Upload, Clipboard, Download, Share2, Settings, Zap, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import ImageUploadZone from './ImageUploadZone';
import ScreenshotEditor from './ScreenshotEditor';
import { generateShortLink, generateShareableUrl } from '@/utils/config';

interface ProcessedImage {
  id: string;
  file: File;
  dataUrl: string;
  metadata: {
    size: number;
    format: string;
    dimensions: { width: number; height: number };
    hasExif: boolean;
  };
}

const ScreenshotCapture = () => {
  const [capturedImages, setCapturedImages] = useState<ProcessedImage[]>([]);
  const [editingImage, setEditingImage] = useState<ProcessedImage | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { processImage, compressImage } = useImageProcessing();

  // Capture screen using modern Screen Capture API
  const captureScreen = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      toast({
        title: "Not Supported",
        description: "Screen capture is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCapturing(true);
      
      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      });

      // Create video element to capture frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.addEventListener('loadedmetadata', () => {
        // Create canvas and capture frame
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          
          // Convert to blob and create file
          canvas.toBlob(async (blob) => {
            if (blob) {
              const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' });
              await handleImageCapture([file]);
            }
            
            // Stop the stream
            stream.getTracks().forEach(track => track.stop());
          }, 'image/png', 0.9);
        }
      });

      toast({
        title: "Screen Captured!",
        description: "Screenshot has been captured successfully."
      });

    } catch (error) {
      console.error('Screen capture error:', error);
      toast({
        title: "Capture Failed",
        description: "Failed to capture screen. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCapturing(false);
    }
  }, []);

  // Handle paste from clipboard
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));
    
    if (imageItems.length === 0) {
      toast({
        title: "No Image Found",
        description: "No image found in clipboard.",
        variant: "destructive"
      });
      return;
    }

    const files: File[] = [];
    for (const item of imageItems) {
      const file = item.getAsFile();
      if (file) {
        files.push(file);
      }
    }

    if (files.length > 0) {
      await handleImageCapture(files);
      toast({
        title: "Image Pasted!",
        description: `${files.length} image(s) pasted from clipboard.`
      });
    }
  }, []);

  // Process captured/uploaded images
  const handleImageCapture = useCallback(async (files: File[]) => {
    const processedImages: ProcessedImage[] = [];
    
    for (const file of files) {
      try {
        const processed = await processImage(file);
        const compressed = await compressImage(processed.file);
        
        processedImages.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file: compressed,
          dataUrl: processed.dataUrl,
          metadata: processed.metadata
        });
      } catch (error) {
        console.error('Image processing error:', error);
        toast({
          title: "Processing Error",
          description: `Failed to process ${file.name}`,
          variant: "destructive"
        });
      }
    }

    if (processedImages.length > 0) {
      setCapturedImages(prev => [...prev, ...processedImages]);
    }
  }, [processImage, compressImage]);

  // Save image to gallery
  const saveToGallery = (image: ProcessedImage, editedDataUrl?: string) => {
    const screenshot = {
      id: image.id,
      dataUrl: editedDataUrl || image.dataUrl,
      title: `Screenshot ${new Date().toLocaleString()}`,
      description: 'Captured screenshot',
      timestamp: new Date(),
      shortLink: generateShortLink(image.id),
      seoTitle: `Screenshot - ${new Date().toLocaleDateString()}`,
      seoDescription: 'Professional screenshot captured and processed',
      tags: ['screenshot', 'capture']
    };

    // Save to localStorage (in production, this would be saved to your database)
    const existing = JSON.parse(localStorage.getItem('screenshots') || '[]');
    existing.push(screenshot);
    localStorage.setItem('screenshots', JSON.stringify(existing));

    toast({
      title: "Saved!",
      description: "Screenshot saved to gallery with shareable link."
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" onPaste={handlePaste} tabIndex={0}>
      {/* Capture Controls */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-purple-600" />
            Screen Capture & Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={captureScreen}
              disabled={isCapturing}
              className="h-20 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <div className="flex flex-col items-center gap-2">
                {isCapturing ? (
                  <Zap className="h-6 w-6 animate-pulse" />
                ) : (
                  <Camera className="h-6 w-6" />
                )}
                <span>{isCapturing ? 'Capturing...' : 'Capture Screen'}</span>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-20 border-2 border-dashed hover:border-purple-400"
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6" />
                <span>Upload Files</span>
              </div>
            </Button>

            <div className="flex flex-col items-center justify-center h-20 bg-gray-50 rounded-lg border-2 border-dashed">
              <Clipboard className="h-6 w-6 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Press Ctrl+V to paste</span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                handleImageCapture(files);
              }
            }}
            className="hidden"
          />

          <div className="mt-6">
            <ImageUploadZone onImagesUploaded={handleImageCapture} />
          </div>
        </CardContent>
      </Card>

      {/* Captured Images */}
      {capturedImages.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-green-600" />
              Captured Images ({capturedImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {capturedImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.dataUrl}
                    alt="Captured"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setEditingImage(image)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingImage(image)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => saveToGallery(image)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {(image.metadata.size / 1024).toFixed(1)}KB • {image.metadata.format.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Editor Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-hidden w-full">
            <ScreenshotEditor
              image={editingImage}
              onSave={(editedDataUrl) => {
                saveToGallery(editingImage, editedDataUrl);
                setEditingImage(null);
              }}
              onClose={() => setEditingImage(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotCapture;
