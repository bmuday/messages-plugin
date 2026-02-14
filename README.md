# EmojiFeed 🎭

> Share emoji reactions and comments on any webpage with thematic communities

EmojiFeed is a Chrome extension that transforms the web into a social space by allowing communities to share their emotional reactions and short comments on any page.

## Features

- **Universal Reactions**: Add emoji reactions to any webpage
- **Community-Driven**: Filter reactions by thematic communities (Tech, Cuisine, Sport, Art, Gaming)
- **Real-time Updates**: See reactions appear instantly as others interact
- **Non-Intrusive Overlay**: Lightweight floating button that doesn't break page layouts
- **Short Comments**: Share thoughts in 280 characters or less

## Tech Stack

- **Frontend**: Chrome Extension (Manifest V3)
- **Backend**: Appwrite (Database, Authentication, Realtime)
- **UI Framework**: Vue.js 3 + Pinia
- **Build Tool**: Vite + @crxjs/vite-plugin

## Setup

### Prerequisites

- Node.js 18+ and npm
- Chrome/Chromium browser
- Appwrite account ([cloud.appwrite.io](https://cloud.appwrite.io))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd emojifeed
```

2. Install dependencies:
```bash
npm install
```

3. Configure Appwrite:
   - Create a new project on Appwrite
   - Create a database
   - Set up collections (see [Appwrite Setup](#appwrite-setup))
   - Copy `.env.example` to `.env` and fill in your Appwrite credentials

4. Build the extension:
```bash
npm run build
```

5. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Development Mode

```bash
npm run dev
```

Then load the extension from the `dist` folder in Chrome developer mode.

## Appwrite Setup

Create the following collections in your Appwrite database:

### 1. users
- userId (string, unique, required)
- username (string, required)
- email (string, unique, required)
- avatarUrl (string, optional)
- communities (string[], array)
- createdAt (datetime, required)

### 2. communities
- name (string, required)
- slug (string, unique, required)
- description (string)
- color (string, required) - hex code
- icon (string) - emoji
- memberCount (integer, default: 0)
- createdAt (datetime, required)

### 3. pages
- urlHash (string, unique, required) - SHA-256 of normalized URL
- normalizedUrl (string, required)
- pageTitle (string)
- domain (string, required)
- totalReactions (integer, default: 0)
- reactionBreakdown (string) - JSON of counts per emoji
- firstSeenAt (datetime, required)
- lastActivityAt (datetime, required)

### 4. reactions
- pageId (string, required) - reference to pages.$id
- userId (string, required) - reference to users.userId
- communityId (string, required) - reference to communities.$id
- emoji (string, required) - one of: ❤️ 😂 😮 🔥 💡 👎
- comment (string, max 280 chars)
- createdAt (datetime, required)
- updatedAt (datetime, required)

### 5. trending
- pageId (string, required)
- period (string, required) - "24h", "7d", "30d"
- score (float, required)
- reactionCount (integer, required)
- calculatedAt (datetime, required)

### Seed Communities

Add these initial communities:
- Tech (#3B82F6, 💻)
- Cuisine (#EF4444, 🍳)
- Sport (#10B981, ⚽)
- Art (#8B5CF6, 🎨)
- Gaming (#F59E0B, 🎮)

## Project Structure

```
emojifeed/
├── public/
│   ├── icons/           # Extension icons
│   └── manifest.json    # Chrome extension manifest
├── src/
│   ├── background/      # Background service worker
│   ├── content/         # Content scripts (injected into pages)
│   ├── popup/           # Extension popup interface
│   ├── components/      # Vue components
│   │   ├── overlay/     # Overlay components (injected)
│   │   └── shared/      # Shared components
│   ├── store/           # Pinia stores
│   ├── services/        # Business logic layer
│   ├── utils/           # Utilities
│   ├── config/          # Configuration
│   └── assets/          # Styles and images
└── package.json
```

## Architecture

- **Content Script**: Injects Vue app into Shadow DOM on every page
- **Background Service Worker**: Handles Appwrite communication and message routing
- **Popup**: User profile, trending pages, settings
- **Shadow DOM**: Isolates extension UI from host page CSS

## Development

### Key Commands

```bash
npm run dev      # Development mode with HMR
npm run build    # Production build
npm run preview  # Preview production build
```

### Testing

1. Load extension in Chrome
2. Visit any webpage
3. Click the floating EmojiFeed button
4. Add reactions and comments
5. Open popup to see trending pages

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## License

MIT

## Credits

Built with ❤️ using Vue.js, Appwrite, and the @crxjs/vite-plugin
