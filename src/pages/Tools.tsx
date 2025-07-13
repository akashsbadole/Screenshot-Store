
import { useState } from 'react';
import { 
  Image, 
  Download, 
  FileImage, 
  Layers, 
  Camera, 
  Minimize2,
  RotateCw,
  Package,
  Info,
  Droplets
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageUploadZone } from '@/components/ImageUploadZone';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { UploadOptions } from '@/types/screenshot';
import { toast } from '@/hooks/use-toast';

const Tools = () => {
  const [activeFiles, setActiveFiles] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const { compressImage, convertFormat, removeExifData, processMultipleImages } = useImageProcessing();

  const defaultUploadOptions: UploadOptions = {
    compress: true,
    quality: 80,
    format: 'png',
    removeExif: false,
    addWatermark: false
  };

  const handleImagesProcessed = (dataUrls: string[], files: File[]) => {
    setActiveFiles(files);
    setProcessedImages(dataUrls);
    toast({
      title: "Images Processed!",
      description: `${files.length} images ready for processing.`
    });
  };

  const handleImageCompression = async () => {
    if (activeFiles.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload images first.",
        variant: "destructive"
      });
      return;
    }

    const compressed = await Promise.all(
      activeFiles.map(file => compressImage(file, 0.7))
    );

    compressed.forEach((file, index) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `compressed-${activeFiles[index].name}`;
      link.click();
    });

    toast({
      title: "Compression Complete!",
      description: `${compressed.length} images compressed and downloaded.`
    });
  };

  const handleFormatConversion = async (format: string) => {
    if (activeFiles.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload images first.",
        variant: "destructive"
      });
      return;
    }

    const converted = await Promise.all(
      activeFiles.map(file => convertFormat(file, `image/${format}`))
    );

    converted.forEach((file, index) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = file.name;
      link.click();
    });

    toast({
      title: "Conversion Complete!",
      description: `${converted.length} images converted to ${format.toUpperCase()}.`
    });
  };

  const handleExifRemoval = async () => {
    if (activeFiles.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload images first.",
        variant: "destructive"
      });
      return;
    }

    const cleaned = await Promise.all(
      activeFiles.map(file => removeExifData(file))
    );

    cleaned.forEach((file, index) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `clean-${activeFiles[index].name}`;
      link.click();
    });

    toast({
      title: "EXIF Data Removed!",
      description: `${cleaned.length} images cleaned and downloaded.`
    });
  };

  const tools = [
    {
      id: 'compress',
      title: 'Image Compression',
      description: 'Reduce file size while maintaining quality',
      icon: Minimize2,
      action: handleImageCompression
    },
    {
      id: 'convert',
      title: 'Format Conversion',
      description: 'Convert between different image formats',
      icon: RotateCw,
      formats: ['png', 'jpg', 'webp']
    },
    {
      id: 'exif',
      title: 'EXIF Data Management',
      description: 'Remove metadata from images',
      icon: Info,
      action: handleExifRemoval
    },
    {
      id: 'watermark',
      title: 'Watermarking',
      description: 'Add watermarks to protect your images',
      icon: Droplets,
      action: () => toast({ title: "Coming Soon!", description: "Watermarking feature will be available soon." })
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Image Processing Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional image processing tools for compression, conversion, and optimization
          </p>
        </div>

        <Tabs defaultValue="upload" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="tools">Processing Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Bulk Image Upload
                </CardTitle>
                <CardDescription>
                  Upload multiple images for batch processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploadZone 
                  onImagesProcessed={handleImagesProcessed}
                  uploadOptions={defaultUploadOptions}
                />
                
                {processedImages.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Uploaded Images ({processedImages.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {processedImages.map((dataUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={dataUrl}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <div className="absolute bottom-1 left-1 right-1">
                            <div className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                              {activeFiles[index]?.name || `Image ${index + 1}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <tool.icon className="h-5 w-5 text-blue-600" />
                      {tool.title}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tool.id === 'convert' && tool.formats ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 mb-3">Convert to format:</p>
                        <div className="flex gap-2">
                          {tool.formats.map((format) => (
                            <Button
                              key={format}
                              variant="outline"
                              size="sm"
                              onClick={() => handleFormatConversion(format)}
                            >
                              {format.toUpperCase()}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Button 
                        onClick={tool.action}
                        className="w-full"
                      >
                        {tool.title}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;
