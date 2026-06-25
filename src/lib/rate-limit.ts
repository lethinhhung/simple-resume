// Best-effort, in-memory sliding-window rate limiter backing the /api/autofill
// route. State lives in a module-level map: it is per serverless instance and
// resets on cold start, so it is a UX/abuse guardrail — not a hard security
// boundary. `now` is injected so the logic is deterministically testable.

export const RATE_LIMIT = 5;
export const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

const store = new Map<string, number[]>();

function recentFor(key: string, now: number): number[] {
  return (store.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
}

/** Report whether `key` may make a request at `now`, without recording it. */
export function checkRateLimit(key: string, now: number): RateLimitResult {
  const recent = recentFor(key, now);
  if (recent.length >= RATE_LIMIT) {
    const oldest = Math.min(...recent);
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: RATE_WINDOW_MS - (now - oldest),
    };
  }
  return { allowed: true, remaining: RATE_LIMIT - recent.length, retryAfterMs: 0 };
}

/** Record a request for `key` at `now`, pruning entries that have aged out. */
export function recordRequest(key: string, now: number): void {
  const recent = recentFor(key, now);
  recent.push(now);
  store.set(key, recent);
}

/** Clears all rate-limit state. Intended for tests. */
export function resetRateLimit(): void {
  store.clear();
}
