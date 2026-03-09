# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ── Stage 2: Build ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

# NEXT_PUBLIC_* vars are baked into the JS bundle at build time — pass as ARG
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Generate Prisma client then build Next.js
RUN npm run build

# ── Stage 3: Production runtime ────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Only copy what Next.js needs to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Runtime secrets are injected via environment variables (docker-compose / K8s)
# Do NOT bake GEMINI_API_KEY, DATABASE_URL, or UPSTASH_* into the image.

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
