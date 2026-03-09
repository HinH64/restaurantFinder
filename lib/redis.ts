import { Redis } from '@upstash/redis'

// Redis client - initialized from environment variables
// Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local
// Get these from Vercel Dashboard → Storage → Create Database → Upstash Redis
export const redis = Redis.fromEnv()
