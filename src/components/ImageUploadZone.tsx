
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { UploadOptions } from '@/types/screenshot';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Eye, 
  FileImage,
  Loader2
} from 'lucide-react';

interface ImageUploadZoneProps {
  onImagesProcessed: (dataUrls: string[], files: File[]) => void;
  uploadOptions: UploadOptions;
  maxFiles?: number;
}

export const ImageUploadZone = ({ 
  onImagesProcessed, 
  uploadOptions, 
  maxFiles = 10 
}: ImageUploadZoneProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { isProcessing, processMultipleImages } = useImageProcessing();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please select only image files.",
        variant: "destructive"
      });
      return;
    }

    if (selectedFiles.length + imageFiles.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Maximum ${maxFiles} files allowed.`,
        variant: "destructive"
      });
      return;
    }

    // Create preview URLs
    const newPreviewUrls = await Promise.all(
      imageFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );

    setSelectedFiles(prev => [...prev, ...imageFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

    toast({
      title: "Files Added",
      description: `${imageFiles.length} image(s) ready for upload.`
    });
  }, [selectedFiles.length, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg']
    },
    multiple: true,
    maxFiles
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const processAndUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const processedImages = await processMultipleImages(
        selectedFiles,
        uploadOptions,
        setUploadProgress
      );

      onImagesProcessed(processedImages, selectedFiles);
      
      // Clear selection after successful processing
      setSelectedFiles([]);
      setPreviewUrls([]);
      setUploadProgress(0);

      toast({
        title: "Upload Complete",
        description: `${processedImages.length} image(s) processed successfully.`
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to process images. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer transition-colors ${
              isDragActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-full ${
                isDragActive 
                  ? 'bg-blue-100 dark:bg-blue-800' 
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <Upload className={`h-8 w-8 ${
                  isDragActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {isDragActive ? 'Drop images here' : 'Drag & drop images'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  or click to browse files
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Supports PNG, JPG, GIF, WebP (max {maxFiles} files)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Preview Grid */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFiles([]);
                  setPreviewUrls([]);
                }}
                disabled={isProcessing}
              >
                Clear All
              </Button>
              <Button
                onClick={processAndUpload}
                disabled={isProcessing || selectedFiles.length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Process & Upload
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Processing images...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* File Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-3">
                  <div className="relative aspect-square mb-2">
                    <img
                      src={previewUrls[index]}
                      alt={file.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-md flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {formatFileSize(file.size)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {file.type.split('/')[1].toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
