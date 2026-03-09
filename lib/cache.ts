import { redis } from './redis'

/**
 * Fetch from cache or compute the value and cache it.
 * @param key   Redis cache key
 * @param ttl   Time-to-live in seconds
 * @param fn    Async function to compute the value on cache miss
 */
export async function withCache<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get<T>(key)
    if (cached !== null) return cached
  } catch {
    // Redis unavailable — fall through to compute
  }

  const result = await fn()

  try {
    await redis.setex(key, ttl, result)
  } catch {
    // Redis unavailable — still return the result
  }

  return result
}

// TTL constants (seconds)
export const TTL = {
  AI_SUMMARY: 86400,   // 24 hours — AI summaries rarely need refreshing
  AI_SEARCH: 1800,     // 30 minutes — search results more volatile
  REGIONS: 86400,      // 24 hours — region/district data is very stable
}
