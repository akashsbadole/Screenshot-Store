
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Search, 
  Share2, 
  Download, 
  Copy, 
  Trash2, 
  Eye,
  Calendar,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

interface Screenshot {
  id: string;
  dataUrl: string;
  title: string;
  description: string;
  timestamp: Date;
  shortLink?: string;
}

const ScreenshotGallery = () => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);

  // Load screenshots from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('screenshots');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((s: any) => ({
          ...s,
          timestamp: new Date(s.timestamp)
        }));
        setScreenshots(parsed);
      } catch (error) {
        console.error('Error loading screenshots:', error);
      }
    }
  }, []);

  // Save screenshots to localStorage whenever screenshots change
  useEffect(() => {
    localStorage.setItem('screenshots', JSON.stringify(screenshots));
  }, [screenshots]);

  const filteredScreenshots = screenshots.filter(screenshot =>
    screenshot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    screenshot.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = async (text: string) => {
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
  };

  const downloadScreenshot = (screenshot: Screenshot) => {
    const link = document.createElement('a');
    link.download = `${screenshot.title}.png`;
    link.href = screenshot.dataUrl;
    link.click();
    
    toast({
      title: "Downloaded!",
      description: "Screenshot has been downloaded to your device."
    });
  };

  const deleteScreenshot = (id: string) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
    if (selectedScreenshot?.id === id) {
      setSelectedScreenshot(null);
    }
    
    toast({
      title: "Deleted!",
      description: "Screenshot has been removed from your gallery."
    });
  };

  const generateDemoScreenshots = () => {
    const demoScreenshots: Screenshot[] = [
      {
        id: '1',
        dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzM0OThmMyIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EZW1vIFNjcmVlbnNob3QgMTwvdGV4dD4KPC9zdmc+',
        title: 'Project Dashboard',
        description: 'Main dashboard overview with analytics',
        timestamp: new Date(Date.now() - 86400000),
        shortLink: 'https://scrnshot.ly/abc123'
      },
      {
        id: '2',
        dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzEwYjk4MSIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EZW1vIFNjcmVlbnNob3QgMjwvdGV4dD4KPC9zdmc+',
        title: 'User Profile Settings',
        description: 'Account settings and preferences panel',
        timestamp: new Date(Date.now() - 172800000),
        shortLink: 'https://scrnshot.ly/def456'
      },
      {
        id: '3',
        dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1OWU0YiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EZW1vIFNjcmVlbnNob3QgMzwvdGV4dD4KPC9zdmc+',
        title: 'Chart Analytics',
        description: 'Performance metrics and data visualization',
        timestamp: new Date(Date.now() - 259200000)
      }
    ];

    setScreenshots(demoScreenshots);
    
    toast({
      title: "Demo Screenshots Added!",
      description: "Sample screenshots have been added to your gallery."
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header and Search */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ImageIcon className="h-6 w-6 text-purple-600" />
              Screenshot Gallery
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search screenshots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredScreenshots.length} screenshot{filteredScreenshots.length !== 1 ? 's' : ''} found
            </p>
            {screenshots.length === 0 && (
              <Button onClick={generateDemoScreenshots} variant="outline">
                Add Demo Screenshots
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Screenshot Grid */}
      {filteredScreenshots.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Screenshots Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by capturing your first screenshot'}
            </p>
            {!searchTerm && (
              <Button onClick={generateDemoScreenshots} variant="outline">
                Add Demo Screenshots
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScreenshots.map((screenshot) => (
            <Card key={screenshot.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={screenshot.dataUrl}
                    alt={screenshot.title}
                    className="w-full h-40 object-cover rounded-lg bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedScreenshot(screenshot)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-lg transition-all duration-300 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 truncate">{screenshot.title}</h3>
                
                {screenshot.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{screenshot.description}</p>
                )}
                
                <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {screenshot.timestamp.toLocaleDateString()}
                  {screenshot.shortLink && (
                    <Badge variant="secondary" className="text-xs">
                      Shared
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadScreenshot(screenshot)}
                    className="flex-1"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  
                  {screenshot.shortLink ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(screenshot.shortLink!)}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Link
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteScreenshot(screenshot.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedScreenshot.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {selectedScreenshot.timestamp.toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedScreenshot(null)}
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-auto">
              <img
                src={selectedScreenshot.dataUrl}
                alt={selectedScreenshot.title}
                className="w-full h-auto rounded-lg"
              />
              
              {selectedScreenshot.description && (
                <p className="text-gray-700 mt-4">{selectedScreenshot.description}</p>
              )}
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <Button
                onClick={() => downloadScreenshot(selectedScreenshot)}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              {selectedScreenshot.shortLink ? (
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(selectedScreenshot.shortLink!)}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Copy Share Link
                </Button>
              ) : (
                <Button variant="outline" className="flex-1" disabled>
                  <Share2 className="h-4 w-4 mr-2" />
                  Generate Share Link
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotGallery;
