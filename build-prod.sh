#!/bin/bash

echo "🚀 Building EmojiFeed for production..."

# Clean dist folder
rm -rf dist
mkdir -p dist

# Build with production config
npx vite build --config vite.config.prod.js

# Copy static files
echo "📦 Copying static files..."

# Copy manifest
cp public/manifest.json dist/manifest.json

# Copy icons
mkdir -p dist/icons
cp -r public/icons/* dist/icons/

# Copy popup HTML
mkdir -p dist/src/popup
cp src/popup/popup.html dist/src/popup/popup.html

# Update manifest to point to correct files
cat > dist/manifest.json << 'EOF'
{
  "manifest_version": 3,
  "name": "EmojiFeed",
  "version": "1.0.0",
  "description": "Share emoji reactions and comments on any webpage with communities",
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "action": {
    "default_popup": "src/popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "src/background/service-worker.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content/index.js"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  },
  "web_accessible_resources": [
    {
      "resources": ["assets/*"],
      "matches": ["<all_urls>"]
    }
  ]
}
EOF

echo "✅ Build complete! Extension ready in dist/"
echo ""
echo "📍 Next steps:"
echo "  1. Load unpacked extension from 'dist/' folder in Chrome"
echo "  2. Configure Appwrite credentials in .env"
echo "  3. Rebuild with: ./build-prod.sh"
