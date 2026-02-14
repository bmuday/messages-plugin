# EmojiFeed - Setup Guide

## 🎯 Project Status

✅ **COMPLETE!** All core files have been created. Follow the steps below to run the extension.

## 📋 Prerequisites

1. **Node.js 18+** and npm installed
2. **Chrome/Chromium browser**
3. **Appwrite account** at [cloud.appwrite.io](https://cloud.appwrite.io)

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Setup Appwrite

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io) and create an account
2. Create a new project named "EmojiFeed"
3. Create a new database named "emojifeed-db"

#### Create Collections

Create these 5 collections with the following attributes:

**Collection 1: users**
- userId (string, 36, required, unique index)
- username (string, 50, required)
- email (string, 255, required, unique index)
- avatarUrl (string, 500, optional)
- communities (string[], array, optional)
- createdAt (datetime, required)

**Collection 2: communities**
- name (string, 50, required)
- slug (string, 50, required, unique index)
- description (string, 500, optional)
- color (string, 7, required) - hex color code
- icon (string, 10, optional) - emoji
- memberCount (integer, required, default: 0)
- createdAt (datetime, required)

**Collection 3: pages**
- urlHash (string, 64, required, unique index)
- normalizedUrl (string, 2000, required)
- pageTitle (string, 500, optional)
- domain (string, 255, required)
- totalReactions (integer, required, default: 0, index)
- reactionBreakdown (string, 500, optional)
- firstSeenAt (datetime, required)
- lastActivityAt (datetime, required, index)

**Collection 4: reactions**
- pageId (string, 36, required, index)
- userId (string, 36, required)
- communityId (string, 36, required, index)
- emoji (string, 10, required)
- comment (string, 280, optional)
- createdAt (datetime, required, index)
- updatedAt (datetime, required)

Add compound index: userId + pageId

**Collection 5: trending**
- pageId (string, 36, required)
- period (string, 20, required)
- score (float, required)
- reactionCount (integer, required)
- calculatedAt (datetime, required)

Add compound index: period + score

#### Set Permissions

For all collections:
- Read: Any
- Create: Users
- Update: Users (own documents only)
- Delete: Users (own documents only)

#### Seed Communities

Add these initial community documents to the "communities" collection:

1. Tech (slug: "tech", color: "#3B82F6", icon: "💻")
2. Cuisine (slug: "cuisine", color: "#EF4444", icon: "🍳")
3. Sport (slug: "sport", color: "#10B981", icon: "⚽")
4. Art (slug: "art", color: "#8B5CF6", icon: "🎨")
5. Gaming (slug: "gaming", color: "#F59E0B", icon: "🎮")

### Step 3: Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Appwrite credentials:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here
VITE_APPWRITE_DATABASE_ID=your-database-id-here
```

**To find your IDs:**
- Project ID: In Appwrite dashboard, go to your project settings
- Database ID: In your database settings

### Step 4: Create Extension Icons

Create placeholder icons in `public/icons/`:

You need 4 icon sizes:
- icon16.png (16x16)
- icon32.png (32x32)
- icon48.png (48x48)
- icon128.png (128x128)

**Quick way to create placeholder icons:**

```bash
mkdir -p public/icons

# Use ImageMagick (if installed) or any image editor
# Create simple colored squares as placeholders
convert -size 16x16 xc:#6366f1 public/icons/icon16.png
convert -size 32x32 xc:#6366f1 public/icons/icon32.png
convert -size 48x48 xc:#6366f1 public/icons/icon48.png
convert -size 128x128 xc:#6366f1 public/icons/icon128.png
```

Or manually create simple PNG files using any image editor.

### Step 5: Build the Extension

**Development mode** (with hot reload):

```bash
npm run dev
```

**Production build**:

```bash
npm run build
```

The extension will be built to the `dist/` folder.

### Step 6: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `dist` folder from your project

## 🧪 Testing

### Test Flow

1. Visit any webpage (e.g., https://news.ycombinator.com)
2. You should see a floating 🎭 button in the bottom-right corner
3. Click it to open the reaction panel
4. Click the extension icon to open the popup
5. Sign up/sign in with an email and password
6. Select an emoji to react
7. Add a comment (optional)
8. See your reaction appear in the list

### Test Realtime

1. Open the same page in 2 different browser windows
2. In window 1, add a reaction
3. Window 2 should show the new reaction instantly

### Test Popup

1. Click the extension icon in Chrome toolbar
2. Navigate between Profile, Trending, and Settings tabs
3. Test logout functionality

## 🐛 Troubleshooting

### Issue: Extension doesn't load

- Check the Chrome console for errors
- Make sure all dependencies are installed (`npm install`)
- Verify the manifest.json is valid
- Try `npm run build` instead of `npm run dev`

### Issue: Appwrite connection fails

- Verify your `.env` file has correct credentials
- Check that your Appwrite project is active
- Ensure collections are created with correct names
- Check browser console for CORS errors

### Issue: Build errors

- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Check that all imports use correct paths
- Verify vite.config.js is correct

### Issue: "Cannot read from undefined" errors

- Make sure Appwrite collections exist
- Verify permissions are set correctly
- Check that seed data (communities) is added

## 📦 Project Structure

```
emojifeed/
├── public/
│   ├── icons/              # Extension icons
│   └── manifest.json       # Chrome extension manifest
├── src/
│   ├── background/         # Background service worker
│   ├── content/            # Content scripts
│   ├── popup/              # Popup interface
│   ├── components/         # Vue components
│   ├── store/              # Pinia stores
│   ├── services/           # Business logic
│   ├── utils/              # Utilities
│   └── config/             # Configuration
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

## 🎉 Next Steps

Once the extension is working:

1. **Improve Icons**: Replace placeholder icons with professional designs
2. **Add Tests**: Write unit tests for stores and services
3. **Optimize Performance**: Add caching and debouncing
4. **Add Features**:
   - Realtime updates (Appwrite Realtime)
   - User avatars and profiles
   - Community management
   - Trending algorithm
   - Export data
5. **Polish UI**: Improve animations and responsiveness
6. **Publish**: Submit to Chrome Web Store

## 📝 Notes

- The extension uses Shadow DOM to isolate CSS from host pages
- All API calls go through the background service worker
- Session is stored in Chrome storage for persistence
- Manifest V3 is used for security and future compatibility

## 🆘 Need Help?

- Check Chrome DevTools console for errors
- Inspect the background service worker: `chrome://extensions/` → Details → Inspect views: service worker
- Check Appwrite logs in the Appwrite dashboard
- Verify network requests in Chrome DevTools Network tab

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] Appwrite project created
- [ ] All 5 collections created with correct attributes
- [ ] Communities seeded
- [ ] .env file configured
- [ ] Icons created in public/icons/
- [ ] Dependencies installed (`npm install`)
- [ ] Extension built (`npm run build`)
- [ ] Extension loaded in Chrome
- [ ] Can see floating button on any webpage
- [ ] Can open reaction panel
- [ ] Can sign up/sign in
- [ ] Can add reactions
- [ ] Popup works

Good luck! 🚀
