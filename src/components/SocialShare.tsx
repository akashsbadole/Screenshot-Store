
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { 
  Share2, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Twitter,
  Copy,
  Mail
} from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

export const SocialShare = ({ url, title, description, imageUrl }: SocialShareProps) => {
  const shareToWhatsApp = () => {
    const text = `${title}\n${description || ''}\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Sharing to WhatsApp",
      description: "Opening WhatsApp..."
    });
  };

  const shareToTwitter = () => {
    const text = `${title} ${url}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
    
    toast({
      title: "Sharing to Twitter",
      description: "Opening Twitter..."
    });
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
    
    toast({
      title: "Sharing to Facebook",
      description: "Opening Facebook..."
    });
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we copy the link
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Link copied to clipboard. You can now paste it in Instagram."
    });
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description || ''}\n\n${url}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
    
    toast({
      title: "Opening Email",
      description: "Email client opening..."
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Link has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link.",
        variant: "destructive"
      });
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyLink();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={shareToWhatsApp}
            className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          
          <Button
            variant="outline"
            onClick={shareToTwitter}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          
          <Button
            variant="outline"
            onClick={shareToFacebook}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          
          <Button
            variant="outline"
            onClick={shareToInstagram}
            className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700"
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </Button>
          
          <Button
            variant="outline"
            onClick={shareViaEmail}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
          
          <Button
            variant="outline"
            onClick={copyLink}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
        </div>
        
        {navigator.share && (
          <Button
            onClick={shareNative}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share (Native)
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
