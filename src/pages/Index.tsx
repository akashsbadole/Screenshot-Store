
import { useState } from 'react';
import { Camera, Share2, Edit3, Zap, MousePointer, Globe, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ScreenshotCapture from '@/components/ScreenshotCapture';
import ScreenshotGallery from '@/components/ScreenshotGallery';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'capture' | 'gallery'>('capture');

  const features = [
    {
      icon: MousePointer,
      title: "Fast Area Selection",
      description: "Select any area on your desktop and take its screenshot with 2 button-clicks."
    },
    {
      icon: Zap,
      title: "Easy-to-use Application",
      description: "Simple and intuitive user interface makes your work with the app easier and faster."
    },
    {
      icon: Share2,
      title: "Share via Internet",
      description: "Upload your screenshot to the server and get its short link right away."
    },
    {
      icon: Edit3,
      title: "Powerful Editors",
      description: "Edit screenshots instantly when taking them or later using a powerful online editor."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
              <Camera className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Screenshot Store
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Capture, edit, and share your screenshots instantly with our powerful web-based tool
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-1 shadow-lg">
              <Button
                variant={activeTab === 'capture' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('capture')}
                className={`rounded-full px-6 py-2 ${
                  activeTab === 'capture' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
              <Button
                variant={activeTab === 'gallery' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('gallery')}
                className={`rounded-full px-6 py-2 ${
                  activeTab === 'gallery' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Image className="h-4 w-4 mr-2" />
                Gallery
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-16">
          {activeTab === 'capture' ? <ScreenshotCapture /> : <ScreenshotGallery />}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-xl mb-6 opacity-90">
            Create your first screenshot and share it with the world
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setActiveTab('capture')}
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Camera className="h-5 w-5 mr-2" />
            Take Screenshot
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
