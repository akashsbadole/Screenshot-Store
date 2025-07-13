
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Camera, Upload, Share2, Edit3, Copy, Download, X, Clipboard, Tag, FileText } from 'lucide-react';
import ScreenshotEditor from './ScreenshotEditor';
import { ImageUploadZone } from './ImageUploadZone';
import { UploadOptions } from '@/types/screenshot';

interface Screenshot {
  id: string;
  dataUrl: string;
  title: string;
  description: string;
  timestamp: Date;
  shortLink?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
}

const ScreenshotCapture = () => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [currentScreenshot, setCurrentScreenshot] = useState<Screenshot | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadOptions: UploadOptions = {
    compress: true,
    quality: 80,
    format: 'png',
    addWatermark: false,
    watermarkText: '',
    removeExif: false
  };

  // Handle paste events for images (Ctrl+V)
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleImageFromFile(file);
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [title, description, seoTitle, seoDescription, tags]);

  const captureScreen = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        toast({
          title: "Not Supported",
          description: "Screen capture is not supported in this browser.",
          variant: "destructive"
        });
        return;
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          
          createScreenshot(dataUrl, title || `Screenshot ${new Date().toLocaleString()}`);
          
          // Stop the stream
          stream.getTracks().forEach(track => track.stop());
          
          toast({
            title: "Screenshot Captured!",
            description: "Your screenshot has been captured successfully."
          });
        }
      });

    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast({
        title: "Capture Failed",
        description: "Failed to capture screenshot. Please try again.",
        variant: "destructive"
      });
    }
  }, [title, description, seoTitle, seoDescription, tags]);

  const handleImageFromFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      createScreenshot(dataUrl, title || file.name);
      
      toast({
        title: "Image Added!",
        description: "Your image has been added successfully."
      });
    };
    reader.readAsDataURL(file);
  }, [title, description, seoTitle, seoDescription, tags]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFromFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  }, [handleImageFromFile]);

  const handleImagesProcessed = useCallback((dataUrls: string[], files: File[]) => {
    dataUrls.forEach((dataUrl, index) => {
      const file = files[index];
      createScreenshot(dataUrl, title || file.name);
    });
  }, [title, description, seoTitle, seoDescription, tags]);

  const createScreenshot = (dataUrl: string, screenshotTitle: string) => {
    const newScreenshot: Screenshot = {
      id: Date.now().toString(),
      dataUrl,
      title: screenshotTitle,
      description: description || '',
      timestamp: new Date(),
      seoTitle: seoTitle || screenshotTitle,
      seoDescription: seoDescription || description || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
    };

    setCurrentScreenshot(newScreenshot);
    setScreenshots(prev => {
      const updated = [newScreenshot, ...prev];
      localStorage.setItem('screenshots', JSON.stringify(updated));
      return updated;
    });
  };

  const generateShortLink = useCallback(async (screenshot: Screenshot) => {
    setIsUploading(true);
    try {
      // Simulate API call to generate short link with SEO data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const shortLink = `https://scrnshot.ly/${Math.random().toString(36).substr(2, 8)}`;
      
      setScreenshots(prev => {
        const updated = prev.map(s => 
          s.id === screenshot.id 
            ? { ...s, shortLink } 
            : s
        );
        localStorage.setItem('screenshots', JSON.stringify(updated));
        return updated;
      });
      
      setCurrentScreenshot(prev => 
        prev?.id === screenshot.id 
          ? { ...prev, shortLink }
          : prev
      );

      await navigator.clipboard.writeText(shortLink);
      
      toast({
        title: "Shareable Link Generated!",
        description: "Short link with SEO data has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Failed to Generate Link",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const downloadScreenshot = useCallback((screenshot: Screenshot) => {
    const link = document.createElement('a');
    link.download = `${screenshot.title}.png`;
    link.href = screenshot.dataUrl;
    link.click();
    
    toast({
      title: "Downloaded!",
      description: "Screenshot has been downloaded to your device."
    });
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  }, []);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setSeoTitle('');
    setSeoDescription('');
    setTags('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Capture Controls */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Camera className="h-6 w-6 text-blue-600" />
            Capture & Share Screenshots
          </CardTitle>
          <p className="text-gray-600">Capture, paste, or upload images to create shareable links with SEO optimization</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter screenshot title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="web, design, screenshot..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* SEO Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="h-5 w-5" />
              SEO Details (for sharing)
            </h3>
            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                placeholder="Optimized title for social sharing..."
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                placeholder="Description that will appear when shared on social media..."
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <ImageUploadZone
            onImagesProcessed={handleImagesProcessed}
            uploadOptions={uploadOptions}
            maxFiles={10}
          />
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={captureScreen}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Camera className="h-5 w-5 mr-2" />
              Capture Screen
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              size="lg"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Image
            </Button>

            <Button 
              variant="outline" 
              size="lg"
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <Clipboard className="h-5 w-5 mr-2" />
              Paste Image (Ctrl+V)
            </Button>

            {(title || description || seoTitle || seoDescription || tags) && (
              <Button 
                variant="ghost" 
                onClick={clearForm}
                size="lg"
              >
                <X className="h-5 w-5 mr-2" />
                Clear Form
              </Button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Screenshot Editor */}
      {isEditing && currentScreenshot && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-purple-600" />
              Edit Screenshot
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScreenshotEditor
              screenshot={currentScreenshot}
              onSave={(editedScreenshot) => {
                setCurrentScreenshot(editedScreenshot);
                setScreenshots(prev => {
                  const updated = prev.map(s => s.id === editedScreenshot.id ? editedScreenshot : s);
                  localStorage.setItem('screenshots', JSON.stringify(updated));
                  return updated;
                });
                setIsEditing(false);
                toast({
                  title: "Screenshot Updated!",
                  description: "Your edits have been saved."
                });
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Current Screenshot Display */}
      {currentScreenshot && !isEditing && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <h3 className="text-xl">{currentScreenshot.title}</h3>
                {currentScreenshot.tags && currentScreenshot.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {currentScreenshot.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadScreenshot(currentScreenshot)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <img
                src={currentScreenshot.dataUrl}
                alt={currentScreenshot.title}
                className="w-full h-auto rounded-lg shadow-md max-h-96 object-contain bg-gray-50"
              />
            </div>
            
            {currentScreenshot.description && (
              <p className="text-gray-600">{currentScreenshot.description}</p>
            )}

            {currentScreenshot.seoTitle && currentScreenshot.seoTitle !== currentScreenshot.title && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm text-gray-700 mb-1">SEO Title:</h4>
                <p className="text-sm text-gray-600">{currentScreenshot.seoTitle}</p>
              </div>
            )}

            {currentScreenshot.seoDescription && currentScreenshot.seoDescription !== currentScreenshot.description && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm text-gray-700 mb-1">SEO Description:</h4>
                <p className="text-sm text-gray-600">{currentScreenshot.seoDescription}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => generateShortLink(currentScreenshot)}
                disabled={isUploading}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {isUploading ? 'Generating...' : 'Generate Shareable Link'}
              </Button>
              
              {currentScreenshot.shortLink && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-1 min-w-0">
                  <code className="text-sm text-gray-700 truncate flex-1">
                    {currentScreenshot.shortLink}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(currentScreenshot.shortLink!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScreenshotCapture;
