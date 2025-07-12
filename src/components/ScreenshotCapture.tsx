
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Camera, Upload, Share2, Edit3, Copy, Download, X } from 'lucide-react';
import ScreenshotEditor from './ScreenshotEditor';

interface Screenshot {
  id: string;
  dataUrl: string;
  title: string;
  description: string;
  timestamp: Date;
  shortLink?: string;
}

const ScreenshotCapture = () => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [currentScreenshot, setCurrentScreenshot] = useState<Screenshot | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        video: { mediaSource: 'screen' }
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
          
          const newScreenshot: Screenshot = {
            id: Date.now().toString(),
            dataUrl,
            title: title || `Screenshot ${new Date().toLocaleString()}`,
            description: description || '',
            timestamp: new Date()
          };

          setCurrentScreenshot(newScreenshot);
          setScreenshots(prev => [newScreenshot, ...prev]);
          
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
  }, [title, description]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newScreenshot: Screenshot = {
          id: Date.now().toString(),
          dataUrl,
          title: title || file.name,
          description: description || '',
          timestamp: new Date()
        };

        setCurrentScreenshot(newScreenshot);
        setScreenshots(prev => [newScreenshot, ...prev]);
        
        toast({
          title: "Image Uploaded!",
          description: "Your image has been uploaded successfully."
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  }, [title, description]);

  const generateShortLink = useCallback(async (screenshot: Screenshot) => {
    setIsUploading(true);
    try {
      // Simulate API call to generate short link
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const shortLink = `https://scrnshot.ly/${Math.random().toString(36).substr(2, 8)}`;
      
      setScreenshots(prev => 
        prev.map(s => 
          s.id === screenshot.id 
            ? { ...s, shortLink } 
            : s
        )
      );
      
      setCurrentScreenshot(prev => 
        prev?.id === screenshot.id 
          ? { ...prev, shortLink }
          : prev
      );

      await navigator.clipboard.writeText(shortLink);
      
      toast({
        title: "Link Generated!",
        description: "Short link has been copied to your clipboard."
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Capture Controls */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Camera className="h-6 w-6 text-blue-600" />
            Capture Screenshot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Enter screenshot title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          
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
                setScreenshots(prev => 
                  prev.map(s => s.id === editedScreenshot.id ? editedScreenshot : s)
                );
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
              <span>{currentScreenshot.title}</span>
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
            
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => generateShortLink(currentScreenshot)}
                disabled={isUploading}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {isUploading ? 'Generating...' : 'Generate Share Link'}
              </Button>
              
              {currentScreenshot.shortLink && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <code className="text-sm text-gray-700">
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
