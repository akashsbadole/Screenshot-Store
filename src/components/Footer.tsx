
import { Camera, Heart, Github, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Screenshot Store
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Advanced screen capture tool with powerful editing, social sharing, and SEO-optimized short links.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-foreground transition-colors">Drag & Drop Upload</Link></li>
              <li><Link to="/features" className="hover:text-foreground transition-colors">Image Editing</Link></li>
              <li><Link to="/features" className="hover:text-foreground transition-colors">Social Sharing</Link></li>
              <li><Link to="/features" className="hover:text-foreground transition-colors">QR Code Generator</Link></li>
              <li><Link to="/features" className="hover:text-foreground transition-colors">SEO Optimization</Link></li>
              <li><Link to="/features" className="hover:text-foreground transition-colors">Password Protection</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <h4 className="font-semibold">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Screenshot Capture</Link></li>
              <li><Link to="/tools" className="hover:text-foreground transition-colors">Image Compression</Link></li>
              <li><Link to="/tools" className="hover:text-foreground transition-colors">Format Conversion</Link></li>
              <li><Link to="/tools" className="hover:text-foreground transition-colors">Bulk Processing</Link></li>
              <li><Link to="/tools" className="hover:text-foreground transition-colors">EXIF Data Management</Link></li>
              <li><Link to="/tools" className="hover:text-foreground transition-colors">Watermarking</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="mailto:contact@screenshotstore.com">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Open source and free to use
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>© {currentYear} Screenshot Store. Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for the community</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
