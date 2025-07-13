
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Twitter,
  Share2,
  Copy,
  Mail,
  Linkedin
} from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

const SocialShare = ({ url, title, description }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'bg-blue-400 hover:bg-blue-500'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const handleShare = (shareUrl: string, platform: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    toast({
      title: "Opening Share Dialog",
      description: `Sharing to ${platform}...`
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Screenshot
        </CardTitle>
        <p className="text-sm text-gray-600 truncate">{title}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Media Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {shareLinks.map((platform) => (
            <Button
              key={platform.name}
              onClick={() => handleShare(platform.url, platform.name)}
              className={`${platform.color} text-white flex items-center justify-center gap-2`}
              size="sm"
            >
              <platform.icon className="h-4 w-4" />
              {platform.name}
            </Button>
          ))}
        </div>

        {/* Copy Link and Native Share */}
        <div className="space-y-2 pt-4 border-t">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          
          {navigator.share && (
            <Button
              onClick={handleNativeShare}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              More Options
            </Button>
          )}
        </div>

        {/* Direct Link Display */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Direct Link:</p>
          <code className="text-xs text-gray-700 break-all">{url}</code>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialShare;
