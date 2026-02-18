interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

interface RateLimiterEntry {
  count: number;
  resetAt: number;
}

interface RateLimiter {
  check: (key: string) => boolean;
  reset: (key: string) => void;
}

function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const entries = new Map<string, RateLimiterEntry>();

  function cleanup(): void {
    if (entries.size > 100) {
      const now = Date.now();
      for (const [key, entry] of entries) {
        if (now >= entry.resetAt) {
          entries.delete(key);
        }
      }
    }
  }

  function check(key: string): boolean {
    cleanup();

    const now = Date.now();
    const existing = entries.get(key);

    if (!existing || now >= existing.resetAt) {
      entries.set(key, { count: 1, resetAt: now + options.windowMs });
      return true;
    }

    existing.count++;
    if (existing.count > options.maxRequests) {
      return false;
    }

    return true;
  }

  function reset(key: string): void {
    entries.delete(key);
  }

  return { check, reset };
}

export { createRateLimiter };
export type { RateLimiter, RateLimiterOptions };
