
import { useState } from 'react';
import { Camera, Share2, Edit3, Zap, MousePointer, Globe, Image, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import ScreenshotCapture from '@/components/ScreenshotCapture';
import ScreenshotGallery from '@/components/ScreenshotGallery';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'capture' | 'gallery'>('capture');

  const features = [
    {
      icon: MousePointer,
      title: "Fast Area Selection & Copy-Paste",
      description: "Select any area on your desktop with 2 clicks or paste images directly from clipboard (Ctrl+V)."
    },
    {
      icon: Zap,
      title: "Drag & Drop Bulk Upload",
      description: "Intuitive drag & drop interface with bulk upload support. Process multiple images at once with auto-compression."
    },
    {
      icon: Share2,
      title: "Advanced Sharing & QR Codes",
      description: "Generate short links with SEO optimization, QR codes, password protection, and social media integration."
    },
    {
      icon: Edit3,
      title: "Powerful Editing Suite",
      description: "Professional editing tools with drawing, annotation, text overlay, undo/redo, and version history."
    },
    {
      icon: Palette,
      title: "Dark/Light Mode & PWA",
      description: "Modern responsive design with theme switching and Progressive Web App support for all devices."
    },
    {
      icon: Globe,
      title: "Security & Analytics",
      description: "Password-protected links, expiry timers, watermarking, and comprehensive sharing analytics."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header with Theme Toggle */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pb-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
              <Camera className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 dark:from-blue-400 dark:to-purple-400">
            Screenshot Store
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Advanced screen capture tool with drag & drop upload, powerful editing, social sharing, and SEO-optimized short links
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border border-gray-200 dark:border-gray-700">
              <Button
                variant={activeTab === 'capture' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('capture')}
                className={`rounded-full px-6 py-2 transition-all ${
                  activeTab === 'capture' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture & Upload
              </Button>
              <Button
                variant={activeTab === 'gallery' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('gallery')}
                className={`rounded-full px-6 py-2 transition-all ${
                  activeTab === 'gallery' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Image className="h-4 w-4 mr-2" />
                Gallery & Share
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-16">
          {activeTab === 'capture' ? <ScreenshotCapture /> : <ScreenshotGallery />}
        </div>

        {/* Enhanced Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Sharing?</h2>
          <p className="text-xl mb-6 opacity-90">
            Create professional screenshots with powerful editing and instant sharing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setActiveTab('capture')}
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Camera className="h-5 w-5 mr-2" />
              Start Creating
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setActiveTab('gallery')}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300"
            >
              <Image className="h-5 w-5 mr-2" />
              View Gallery
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
