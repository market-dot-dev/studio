import { describe, expect, it } from "vitest";
import { formatDate } from "./utils";

describe("formatDate", () => {
  it("should format Date object correctly", () => {
    const date = new Date("2023-05-15T12:00:00Z");
    const result = formatDate(date);

    expect(result).toBe("May 15, 2023");
  });

  it("should format date string correctly", () => {
    const dateString = "2023-05-15T12:00:00Z";
    const result = formatDate(dateString);

    expect(result).toBe("May 15, 2023");
  });

  it("should handle different date formats", () => {
    const dateString = "2023/07/22";
    const result = formatDate(dateString);

    expect(result).toBe("Jul 22, 2023");
  });

  it("should use UTC for consistent output", () => {
    // Create a date that's at midnight UTC
    const dateString = "2023-12-31T00:00:00Z";
    const result = formatDate(dateString);

    // Should show Dec 31, not Dec 30, because we're using UTC
    expect(result).toBe("Dec 31, 2023");
  });
});
