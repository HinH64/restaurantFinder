import { Redis } from '@upstash/redis'

// Lazily create the Redis client so a missing/wrong URL doesn't crash the build.
// UPSTASH_REDIS_REST_URL must start with https:// (the REST API URL, not rediss://)
// Get both values from: Upstash Console → your DB → REST API section
let _redis: Redis | null = null

export function getRedis(): Redis | null {
  if (_redis) return _redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  if (!url.startsWith('https://')) {
    console.warn('[Redis] UPSTASH_REDIS_REST_URL must start with https://, not rediss://. Caching disabled.')
    return null
  }
  try {
    _redis = new Redis({ url, token })
    return _redis
  } catch {
    return null
  }
}
