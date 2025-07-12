
-- Screenshot Store Database Schema
-- Supports both SQLite and PostgreSQL

-- Users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Screenshots/Images table
CREATE TABLE IF NOT EXISTS screenshots (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    seo_title TEXT,
    seo_description TEXT,
    original_filename TEXT,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    width INTEGER,
    height INTEGER,
    short_link TEXT UNIQUE,
    qr_code_path TEXT,
    password_hash TEXT,
    expires_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    max_views INTEGER,
    watermark_enabled BOOLEAN DEFAULT FALSE,
    watermark_text TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#3b82f6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Screenshot tags junction table
CREATE TABLE IF NOT EXISTS screenshot_tags (
    screenshot_id TEXT REFERENCES screenshots(id) ON DELETE CASCADE,
    tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (screenshot_id, tag_id)
);

-- Image versions/history table
CREATE TABLE IF NOT EXISTS image_versions (
    id TEXT PRIMARY KEY,
    screenshot_id TEXT REFERENCES screenshots(id) ON DELETE CASCADE,
    version_number INTEGER,
    file_path TEXT NOT NULL,
    edit_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EXIF data table
CREATE TABLE IF NOT EXISTS exif_data (
    id TEXT PRIMARY KEY,
    screenshot_id TEXT REFERENCES screenshots(id) ON DELETE CASCADE,
    camera_make TEXT,
    camera_model TEXT,
    iso INTEGER,
    aperture TEXT,
    shutter_speed TEXT,
    focal_length TEXT,
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    date_taken TIMESTAMP,
    raw_exif_json TEXT
);

-- Social shares tracking table
CREATE TABLE IF NOT EXISTS social_shares (
    id TEXT PRIMARY KEY,
    screenshot_id TEXT REFERENCES screenshots(id) ON DELETE CASCADE,
    platform TEXT NOT NULL, -- 'whatsapp', 'instagram', 'facebook', 'twitter'
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id TEXT PRIMARY KEY,
    screenshot_id TEXT REFERENCES screenshots(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'view', 'download', 'share', 'copy_link'
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_screenshots_user_id ON screenshots(user_id);
CREATE INDEX IF NOT EXISTS idx_screenshots_short_link ON screenshots(short_link);
CREATE INDEX IF NOT EXISTS idx_screenshots_created_at ON screenshots(created_at);
CREATE INDEX IF NOT EXISTS idx_screenshot_tags_screenshot_id ON screenshot_tags(screenshot_id);
CREATE INDEX IF NOT EXISTS idx_screenshot_tags_tag_id ON screenshot_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_image_versions_screenshot_id ON image_versions(screenshot_id);
CREATE INDEX IF NOT EXISTS idx_analytics_screenshot_id ON analytics(screenshot_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
