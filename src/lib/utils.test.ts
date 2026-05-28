import { describe, expect, test } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  test("joins truthy class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  test("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  test("resolves conflicting Tailwind utilities, later wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  test("accepts conditional object syntax from clsx", () => {
    expect(cn({ a: true, b: false, c: true })).toBe("a c");
  });

  test("accepts nested arrays", () => {
    expect(cn(["a", ["b", "c"]])).toBe("a b c");
  });
});
