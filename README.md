# 搵食 (Gourmet Finder)

A restaurant finder app with Google Maps integration and Google Places API for real restaurant data.

## Features

- **Interactive Map** - Google Maps with clickable markers for each restaurant
- **Real Restaurant Data** - Ratings, photos, addresses, price levels from Google Places API
- **Bidirectional Selection** - Click on map markers or list items, both stay in sync
- **Multi-region Support** - Hong Kong, Japan, United Kingdom
- **Bilingual** - Traditional Chinese (繁體中文) and English
- **Filter Options** - By country, city, district, cuisine type, and rating
- **Restaurant Details** - View selected restaurant info with "Open in Google Maps" option
- **Dark Mode** - Toggle between light and dark themes
- **AI-Powered** - Gemini AI integration for enhanced features

## Prerequisites

- Node.js
- Google Maps API Key (with Maps JavaScript API and Places API enabled)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Get a Google Maps API Key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable these APIs:
     - **Maps JavaScript API**
     - **Places API**
   - Create credentials (API Key)
   - (Optional) Restrict the key to your domain for security

3. Configure API Keys in `.env.local`:
     ```
     VITE_GEMINI_API_KEY=your_gemini_api_key
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     ```

4. Run the app:
   ```bash
   npm run dev
   ```

## Docker

### Production Build

```bash
# Build and run with docker-compose
docker compose --env-file .env.local up -d --build

# Or build directly with Docker
docker build \
  --build-arg VITE_GEMINI_API_KEY=your_key \
  --build-arg VITE_GOOGLE_MAPS_API_KEY=your_key \
  -t restaurant-finder .

docker run -p 8080:80 restaurant-finder
```

The app will be available at `http://localhost:8080`

### Development with Hot Reload

```bash
docker compose --profile dev up dev
```

The dev server will be available at `http://localhost:13000`

### CI/CD Deployment

For cloud deployments, pass API keys as build arguments in your CI/CD pipeline:

```yaml
# GitHub Actions example
- name: Build Docker image
  run: |
    docker build \
      --build-arg VITE_GEMINI_API_KEY=${{ secrets.VITE_GEMINI_API_KEY }} \
      --build-arg VITE_GOOGLE_MAPS_API_KEY=${{ secrets.VITE_GOOGLE_MAPS_API_KEY }} \
      -t restaurant-finder .
```

## API Costs

### Google Maps Platform (Free Tier)
- **$200 free credit per month** (covers most small-medium apps)
- Maps JavaScript API: ~28,500 free map loads/month
- Places API: ~5,000 free text searches/month

You need to enable billing on Google Cloud, but you won't be charged unless you exceed the free tier.

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Google Maps JavaScript API
- Google Places API
- Google Gemini AI

## Project Structure

```
├── App.tsx                 # Main app component
├── index.html              # HTML entry with Google Maps loader
├── types.ts                # TypeScript types and data constants
├── components/
│   ├── Header.tsx          # App header with search and language/theme toggle
│   ├── Sidebar.tsx         # Filter sidebar
│   ├── FilterSection.tsx   # Reusable filter component
│   ├── MapView.tsx         # Google Maps with markers
│   ├── ResultsPane.tsx     # Search results list
│   ├── RestaurantDetail.tsx # Selected restaurant detail panel
│   ├── icons.tsx           # SVG icon components
│   ├── ErrorBanner.tsx     # Error display component
│   └── LoadingOverlay.tsx  # Loading state component
├── services/
│   ├── placesService.ts    # Google Places API service
│   └── geminiService.ts    # Gemini AI service
├── hooks/
│   ├── useFilters.ts       # Filter state management
│   ├── useGeolocation.ts   # Browser geolocation
│   ├── useSearch.ts        # Search functionality
│   └── useSideBar.ts       # Sidebar state management
├── constants/
│   └── uiStrings.ts        # Bilingual UI strings
├── data/
│   └── sideBar.json        # Sidebar filter configuration
└── utils/
    └── loadGoogleMaps.ts   # Google Maps loader utility
```

## License

MIT
