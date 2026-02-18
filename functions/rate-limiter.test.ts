import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRateLimiter } from './rate-limiter.js';

describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests under the limit', () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60_000 });

    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip1')).toBe(true);
  });

  it('blocks requests over the limit', () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60_000 });

    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip1')).toBe(false);
    expect(limiter.check('ip1')).toBe(false);
  });

  it('tracks separate keys independently', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 });

    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip1')).toBe(false);
    expect(limiter.check('ip2')).toBe(true);
    expect(limiter.check('ip2')).toBe(false);
  });

  it('resets after the time window expires', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 });

    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip1')).toBe(false);

    vi.advanceTimersByTime(60_001);

    expect(limiter.check('ip1')).toBe(true);
  });

  it('supports manual reset', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 });

    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip1')).toBe(false);

    limiter.reset('ip1');

    expect(limiter.check('ip1')).toBe(true);
  });
});
