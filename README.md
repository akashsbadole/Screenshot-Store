
# Screenshot Store - Advanced Screen Capture & Sharing Tool

A comprehensive web-based screenshot and image sharing platform with advanced editing capabilities, SEO optimization, and social sharing features.

## 🚀 Features

### Core Features
- **Fast Screen Capture**: Capture any area of your desktop with 2 clicks
- **Drag & Drop Upload**: Intuitive file upload with drag and drop support
- **Bulk Upload**: Upload multiple images simultaneously
- **Copy & Paste**: Paste images directly from clipboard (Ctrl+V)
- **Image Preview**: Preview images before upload with thumbnail gallery
- **Auto Compression**: Intelligent image compression to reduce file size

### Image Processing
- **Format Support**: Convert between JPG, PNG, WebP, AVIF formats
- **EXIF Data Handling**: Option to remove or preserve metadata (GPS, camera info)
- **Auto Compression**: Smart compression algorithms to optimize file size
- **Watermarking**: Add customizable watermarks to protect ownership
- **Image History**: Track versions and edits of images

### Advanced Editing Tools
- **Basic Editing**: Crop, rotate, resize images
- **Drawing & Annotation**: Freehand drawing, shapes, arrows for marking
- **Text Overlay**: Add custom text with font selection and positioning
- **Undo/Redo**: Full editing history with undo/redo capabilities
- **Layer Management**: Advanced editing with multiple layers

### Sharing & Collaboration
- **Short Links**: Generate shareable short links for images
- **QR Code Generator**: Create QR codes for quick mobile access
- **Social Media Integration**: One-click sharing to WhatsApp, Instagram, Facebook, Twitter
- **Copy Link Button**: Easy clipboard copying for link sharing
- **SEO Optimization**: Custom titles, descriptions, and meta tags for shared links

### Security & Privacy
- **Password Protection**: Lock shareable links with passwords
- **Link Expiry**: Automatic link expiration after set time or view count
- **Analytics**: Track views, downloads, and sharing statistics
- **Privacy Controls**: Public/private image settings

### User Experience
- **Dark/Light Mode**: Automatic theme switching with system preference
- **Mobile Responsive**: Fully responsive design for all devices
- **PWA Support**: Install as Progressive Web App on any device
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Intuitive UX**: Clean, modern interface optimized for desktop use

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI components
- **State Management**: React hooks, Context API
- **Database**: SQLite/PostgreSQL (configurable)
- **Image Processing**: Canvas API, Web Workers
- **PWA**: Service Workers, Web App Manifest
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── ImageUploadZone.tsx # Drag & drop upload component
│   ├── ScreenshotCapture.tsx # Main capture component
│   ├── ScreenshotEditor.tsx # Image editing tools
│   └── ScreenshotGallery.tsx # Image gallery & management
├── hooks/
│   ├── useImageProcessing.ts # Image compression & processing
│   ├── useTheme.ts         # Dark/light mode management
│   └── use-toast.ts        # Toast notifications
├── types/
│   └── screenshot.ts       # TypeScript type definitions
├── pages/
│   └── Index.tsx          # Main application page
└── lib/
    └── utils.ts           # Utility functions
```

## 🗄️ Database Schema

The application supports both SQLite and PostgreSQL with the following main tables:

- **screenshots**: Main image metadata and settings
- **users**: User accounts and preferences
- **tags**: Image categorization system
- **image_versions**: Edit history and versioning
- **exif_data**: Camera and location metadata
- **analytics**: Usage statistics and tracking

See `schema.sql` for complete database structure.

## 🚀 Deployment Guide

### Method 1: Static Hosting (Recommended for Frontend-only)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Deploy to Netlify**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Method 2: Full-Stack Deployment

1. **Prepare your server** (Ubuntu example):
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   ```

2. **Setup database**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE screenshot_store;
   CREATE USER app_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE screenshot_store TO app_user;
   \q
   ```

3. **Configure application**:
   ```bash
   # Clone your repository
   git clone your-repo-url
   cd screenshot-store
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Setup environment variables
   export DATABASE_URL="postgresql://app_user:your_password@localhost:5432/screenshot_store"
   export DOMAIN_URL="https://yourdomain.com"
   ```

4. **Setup reverse proxy (Nginx)**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           try_files $uri $uri/ /index.html;
           root /path/to/your/dist;
       }
       
       location /api/ {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

5. **Setup SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Method 3: Docker Deployment

1. **Create Dockerfile**:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Create docker-compose.yml**:
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=postgresql://user:password@db:5432/screenshot_store
       depends_on:
         - db
     
     db:
       image: postgres:15
       environment:
         POSTGRES_DB: screenshot_store
         POSTGRES_USER: user
         POSTGRES_PASSWORD: password
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

3. **Deploy**:
   ```bash
   docker-compose up -d
   ```

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/screenshot_store

# Domain for short links
DOMAIN_URL=https://yourdomain.com

# Image storage
UPLOAD_DIR=/path/to/uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes

# Feature flags
ENABLE_ANALYTICS=true
ENABLE_SOCIAL_SHARING=true
ENABLE_PASSWORD_PROTECTION=true

# External services
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

### Customization Options

1. **Branding**: Update logos, colors, and text in `src/pages/Index.tsx`
2. **Features**: Enable/disable features via environment variables
3. **Limits**: Configure upload limits in `src/components/ImageUploadZone.tsx`
4. **Themes**: Customize colors in `tailwind.config.ts`

## 📱 PWA Installation

Users can install the app on their devices:

1. **Desktop**: Click the install icon in the address bar
2. **Mobile**: Use "Add to Home Screen" from browser menu
3. **Features**: Offline support, native app experience

## 🔐 Security Features

- **Input Validation**: All uploads validated and sanitized
- **Rate Limiting**: API endpoints protected against abuse
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Prevention**: Content Security Policy headers
- **File Type Validation**: Only allowed image formats accepted

## 📊 Analytics & Monitoring

Track important metrics:
- Upload volume and file sizes
- Popular sharing platforms
- User engagement patterns
- Performance metrics
- Error rates and debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: [Your docs URL]
- **Issues**: GitHub Issues
- **Email**: support@yourdomain.com
- **Discord**: [Your Discord server]

---

**Made with ❤️ for the screenshot sharing community**
