# 搵食 · Gourmet Finder

A multilingual restaurant discovery app powered by Google Maps and Gemini AI. Search, filter, and explore restaurants across Hong Kong, Japan, and the UK — with AI-generated summaries drawn from real user reviews.

**Live Demo:** [https://restaurant-finder-nine-omega.vercel.app/](https://restaurant-finder-nine-omega.vercel.app/)

---

## Features

- **Interactive Map** — Google Maps with advanced markers; clicking a pin or list item keeps both in sync
- **Smart Filters** — Country, city, district, cuisine, price level, rating, accessibility, child-friendliness, pet policies
- **AI Review Summary** — Gemini AI reads real reviews and returns highlights, drawbacks, and popular dishes
- **AI Natural Language Search** — Describe what you want ("rooftop bar with harbour view") and get matched restaurants
- **Multilingual** — Traditional Chinese 繁中, English, Japanese 日本語
- **Dark / Light Mode** — Persisted via `localStorage`
- **Responsive** — Mobile bottom-sheet pattern; desktop sidebar

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Maps | Google Maps JavaScript API (client-side) |
| AI | Google Gemini `gemini-2.5-flash` — server-side API routes |
| Cache | Upstash Redis (serverless REST) |
| Database | Neon PostgreSQL (serverless) + Prisma v7 |
| Deployment | Vercel |

---

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Entry point → renders App.tsx
│   ├── globals.css             # Tailwind v4 + custom styles
│   └── api/
│       ├── ai/summarize/       # POST — Gemini review summary  (cached 24 h)
│       ├── ai/search/          # POST — Gemini AI restaurant search (cached 30 min)
│       └── regions/            # GET  — countries/cities/districts from DB (cached 24 h)
├── components/                 # React UI components
├── hooks/                      # Custom React hooks (filters, sidebar …)
├── services/
│   ├── geminiService.ts        # Calls /api/ai/* — no SDK in browser
│   └── placesService.ts        # Google Places JS API (browser only)
├── utils/
│   └── loadGoogleMaps.ts       # Dynamically loads Maps JS API
├── lib/
│   ├── redis.ts                # Upstash Redis lazy client
│   ├── cache.ts                # withCache<T>(key, ttl, fn) helper
│   └── db.ts                   # Prisma client singleton (pg adapter)
├── prisma/
│   ├── schema.prisma           # Country, City, District, Cuisine models
│   └── seed.ts                 # Seeds DB from data/sideBar.json
├── data/
│   └── sideBar.json            # Static fallback for region data
└── prisma.config.ts            # Prisma v7 config (reads .env.local)
```

---

## Environment Variables

Create a `.env.local` file at the project root (see `.env` for the full template):

```bash
# Google Maps — public, restrict by HTTP referrer in Google Cloud Console
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# Gemini AI — server-side only, never exposed to the browser
GEMINI_API_KEY=your_key_here

# Neon PostgreSQL — from Vercel Dashboard → Storage → Neon
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require

# Upstash Redis — must start with https://, NOT rediss://
# Get from: Upstash Console → your database → REST API tab
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

> **Vercel deployments:** Add all variables in **Project → Settings → Environment Variables**. `.env.local` is for local development only and is never committed.

---

## Local Development

```bash
# Install dependencies (also runs prisma generate via postinstall)
npm install

# Start dev server on http://localhost:13000
npm run dev
```

---

## Database Setup

Provision a **Neon PostgreSQL** database from Vercel Dashboard → Storage, copy the connection string to `.env.local`, then:

```bash
# Create tables from prisma/schema.prisma
npx prisma migrate dev

# Seed with region data (countries, cities, districts, cuisines)
npx ts-node --esm prisma/seed.ts
```

To add a new region in the future, add it to `data/sideBar.json` and re-run the seed — no code deploy needed.

---

## Cache Strategy

Caching is handled automatically by `lib/cache.ts`. If Redis is not configured, requests fall through to the source APIs silently — the app still works, just without caching.

| Data | TTL |
|---|---|
| AI review summary | 24 hours |
| AI search results | 30 minutes |
| Region / district data | 24 hours |

---

## API Keys Setup

### Google Maps
1. [Google Cloud Console](https://console.cloud.google.com/) → Enable **Maps JavaScript API** and **Places API**
2. Create an API key and restrict it to your domain (HTTP referrers)

### Gemini AI
1. [Google AI Studio](https://aistudio.google.com/) → Get API key

### Google Maps Free Tier
- **$200 free credit/month** covers most small-to-medium apps
- Maps JavaScript API: ~28,500 free map loads/month
- Places API: ~5,000 free text searches/month

---

## Deployment

Deploys automatically to Vercel on push to `main`.

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Build Command | `prisma generate && next build` |
| Storage | Neon (database) + Upstash (Redis cache) |

---

## License

MIT
