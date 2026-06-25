import { beforeEach, describe, expect, test } from "vitest";
import {
  checkRateLimit,
  recordRequest,
  resetRateLimit,
  RATE_LIMIT,
  RATE_WINDOW_MS,
} from "./rate-limit";

beforeEach(() => {
  resetRateLimit();
});

describe("checkRateLimit", () => {
  test("allows when under the limit and reports remaining", () => {
    const now = 1_000_000;
    expect(checkRateLimit("ip", now)).toEqual({
      allowed: true,
      remaining: RATE_LIMIT,
      retryAfterMs: 0,
    });

    recordRequest("ip", now);
    expect(checkRateLimit("ip", now)).toMatchObject({
      allowed: true,
      remaining: RATE_LIMIT - 1,
    });
  });

  test("blocks the request past the limit with a positive retryAfterMs", () => {
    const now = 1_000_000;
    for (let i = 0; i < RATE_LIMIT; i++) recordRequest("ip", now);

    const res = checkRateLimit("ip", now);
    expect(res.allowed).toBe(false);
    expect(res.remaining).toBe(0);
    expect(res.retryAfterMs).toBeGreaterThan(0);
    expect(res.retryAfterMs).toBeLessThanOrEqual(RATE_WINDOW_MS);
  });

  test("prunes requests older than the window, freeing slots", () => {
    const now = 1_000_000;
    for (let i = 0; i < RATE_LIMIT; i++) recordRequest("ip", now);

    const later = now + RATE_WINDOW_MS + 1; // every recorded request has aged out
    expect(checkRateLimit("ip", later)).toMatchObject({
      allowed: true,
      remaining: RATE_LIMIT,
    });
  });

  test("treats an unknown key as an empty log (no throw)", () => {
    expect(() => checkRateLimit("never-seen", 0)).not.toThrow();
    expect(checkRateLimit("never-seen", 0).allowed).toBe(true);
  });

  test("tracks each key independently", () => {
    const now = 1_000_000;
    for (let i = 0; i < RATE_LIMIT; i++) recordRequest("a", now);

    expect(checkRateLimit("a", now).allowed).toBe(false);
    expect(checkRateLimit("b", now).allowed).toBe(true);
  });
});
