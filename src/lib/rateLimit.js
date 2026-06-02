/**
 * Rate Limiting Middleware
 * 
 * In-memory sliding window rate limiter for API routes.
 * For production, replace with Redis-based solution (e.g., Upstash).
 * 
 * Usage in API route:
 *   import { rateLimit } from '@/lib/rateLimit';
 *   const limiter = rateLimit({ interval: 60_000, limit: 10 });
 * 
 *   export async function POST(request) {
 *     const ip = request.headers.get('x-forwarded-for') || 'unknown';
 *     const { success } = limiter.check(ip);
 *     if (!success) return rateLimitResponse();
 *     // ...handle request
 *   }
 */

/**
 * Create a rate limiter instance.
 * @param {object} options
 * @param {number} options.interval - Time window in milliseconds (default: 60000 = 1 min)
 * @param {number} options.limit - Max requests per interval per key (default: 10)
 * @returns {{ check: (key: string) => { success: boolean, remaining: number, reset: number } }}
 */
export function rateLimit({ interval = 60_000, limit = 10 } = {}) {
  const tokenCache = new Map();

  // Periodically clean expired entries to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of tokenCache) {
      if (now - entry.windowStart > interval * 2) {
        tokenCache.delete(key);
      }
    }
  }, interval * 5);

  // Prevent the cleanup from keeping Node alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return {
    /**
     * Check if a request from the given key is allowed.
     * @param {string} key - Identifier (usually IP address)
     * @returns {{ success: boolean, remaining: number, reset: number }}
     */
    check(key) {
      const now = Date.now();
      const entry = tokenCache.get(key);

      if (!entry || now - entry.windowStart > interval) {
        // New window
        tokenCache.set(key, {
          count: 1,
          windowStart: now,
        });
        return {
          success: true,
          remaining: limit - 1,
          reset: now + interval,
        };
      }

      if (entry.count < limit) {
        entry.count++;
        return {
          success: true,
          remaining: limit - entry.count,
          reset: entry.windowStart + interval,
        };
      }

      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        reset: entry.windowStart + interval,
      };
    },
  };
}

// --- Pre-configured limiters for different endpoints ---

/** Booking: 5 requests per minute per IP */
export const bookingLimiter = rateLimit({ interval: 60_000, limit: 5 });

/** Contact form: 3 requests per minute per IP */
export const contactLimiter = rateLimit({ interval: 60_000, limit: 3 });

/** Slot queries: 30 requests per minute per IP (higher — read-only) */
export const slotLimiter = rateLimit({ interval: 60_000, limit: 30 });

/** DPDP data requests: 2 per minute per IP */
export const dataRequestLimiter = rateLimit({ interval: 60_000, limit: 2 });
