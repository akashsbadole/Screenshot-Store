
import { useState } from 'react';
import { 
  Shield, 
  Search, 
  Share2, 
  QrCode, 
  Edit3, 
  Upload,
  Eye,
  Lock,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import SocialShare from '@/components/SocialShare';
import { toast } from '@/hooks/use-toast';

const Features = () => {
  const [demoUrl, setDemoUrl] = useState('https://screenshot-store.com/demo');
  const [seoTitle, setSeoTitle] = useState('Amazing Screenshot Demo');
  const [seoDescription, setSeoDescription] = useState('Professional screenshot with advanced features');
  const [passwordProtection, setPasswordProtection] = useState(false);
  const [password, setPassword] = useState('');

  const features = [
    {
      id: 'drag-drop',
      title: 'Drag & Drop Upload',
      description: 'Intuitive drag and drop interface for easy file uploads',
      icon: Upload,
      demo: 'Try dragging images into the upload zone on the main page'
    },
    {
      id: 'image-editing',
      title: 'Image Editing',
      description: 'Powerful editing tools with drawing, annotation, and filters',
      icon: Edit3,
      demo: 'Capture a screenshot and click edit to access tools'
    },
    {
      id: 'social-sharing',
      title: 'Social Sharing',
      description: 'Share directly to social media platforms',
      icon: Share2,
      component: 'social-share'
    },
    {
      id: 'qr-generator',
      title: 'QR Code Generator',
      description: 'Generate QR codes for easy sharing',
      icon: QrCode,
      component: 'qr-code'
    },
    {
      id: 'seo-optimization',
      title: 'SEO Optimization',
      description: 'Optimize your shared content for search engines',
      icon: Search,
      component: 'seo-optimization'
    },
    {
      id: 'password-protection',
      title: 'Password Protection',
      description: 'Secure your screenshots with password protection',
      icon: Shield,
      component: 'password-protection'
    }
  ];

  const handleSeoOptimization = () => {
    if (!seoTitle || !seoDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in both SEO title and description.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "SEO Optimized!",
      description: "Your content is now optimized for search engines."
    });
  };

  const handlePasswordProtection = () => {
    if (passwordProtection && !password) {
      toast({
        title: "Password Required",
        description: "Please set a password for protection.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: passwordProtection ? "Password Protected!" : "Protection Removed",
      description: passwordProtection 
        ? "Your content is now password protected." 
        : "Password protection has been disabled."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Features & Capabilities
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore all the powerful features available in Screenshot Store
          </p>
        </div>

        <Tabs defaultValue="overview" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demos">Live Demos</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {feature.demo && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        💡 {feature.demo}
                      </p>
                    )}
                    {feature.component && (
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => toast({ title: "Demo Available", description: "Check the Live Demos tab!" })}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Demo
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="demos" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* QR Code Demo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    QR Code Generator Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <QRCodeGenerator url={demoUrl} title="Demo Screenshot" />
                </CardContent>
              </Card>

              {/* Social Share Demo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Social Sharing Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <SocialShare 
                    url={demoUrl}
                    title={seoTitle}
                    description={seoDescription}
                  />
                </CardContent>
              </Card>

              {/* SEO Optimization Demo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    SEO Optimization Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seo-title">SEO Title</Label>
                    <Input
                      id="seo-title"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Enter SEO title..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo-description">SEO Description</Label>
                    <Input
                      id="seo-description"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Enter SEO description..."
                    />
                  </div>
                  <Button onClick={handleSeoOptimization} className="w-full">
                    Optimize SEO
                  </Button>
                </CardContent>
              </Card>

              {/* Password Protection Demo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Password Protection Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="password-protection"
                      checked={passwordProtection}
                      onCheckedChange={setPasswordProtection}
                    />
                    <Label htmlFor="password-protection">Enable Password Protection</Label>
                  </div>
                  {passwordProtection && (
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password..."
                      />
                    </div>
                  )}
                  <Button onClick={handlePasswordProtection} className="w-full">
                    {passwordProtection ? 'Apply Protection' : 'Remove Protection'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Feature Settings
                </CardTitle>
                <CardDescription>
                  Configure default settings for various features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="demo-url">Demo URL</Label>
                  <Input
                    id="demo-url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://your-domain.com/demo"
                  />
                </div>
                <Button onClick={() => toast({ title: "Settings Saved!", description: "Your preferences have been updated." })}>
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
