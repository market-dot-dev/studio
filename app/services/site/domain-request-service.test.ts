import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as domainRequestService from "./domain-request-service";

// Mock the domain import
vi.mock("@/lib/domain", () => ({
  RESERVED_SUBDOMAINS: ["app", "www", "blog", "api", "sites"]
}));

describe("DomainRequestService", () => {
  let mockRequest: NextRequest;
  let mockHeaders: Map<string, string>;

  beforeEach(() => {
    // Create a realistic mock of NextRequest
    mockHeaders = new Map();
    mockHeaders.set("host", "test.market.dev");

    mockRequest = {
      headers: {
        get: (name: string) => mockHeaders.get(name) || null
      },
      nextUrl: {
        protocol: "https:"
      }
    } as unknown as NextRequest;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getHostnameFromRequest", () => {
    it("should return the host from request headers", async () => {
      mockHeaders.set("host", "example.com");

      const result = await domainRequestService.getHostnameFromRequest(mockRequest);
      expect(result).toBe("example.com");
    });

    it("should return empty string when host header is not present", async () => {
      mockHeaders.delete("host");

      const result = await domainRequestService.getHostnameFromRequest(mockRequest);
      expect(result).toBe("");
    });
  });

  describe("isVercelPreview", () => {
    it("should return true for Vercel preview URLs", async () => {
      mockHeaders.set("host", "store-git-feature-branch-marketdotdev.vercel.app");

      const result = await domainRequestService.isVercelPreview(mockRequest);
      expect(result).toBe(true);
    });

    it("should return false for non-Vercel preview URLs", async () => {
      mockHeaders.set("host", "app.example.com");

      const result = await domainRequestService.isVercelPreview(mockRequest);
      expect(result).toBe(false);
    });
  });

  describe("getSubdomainFromRequest", () => {
    it("should return the subdomain when present", async () => {
      mockHeaders.set("host", "blog.example.com");

      const result = await domainRequestService.getSubdomainFromRequest(mockRequest);
      expect(result).toBe("blog");
    });

    it("should return null when no subdomain is present", async () => {
      mockHeaders.set("host", "example.com");

      const result = await domainRequestService.getSubdomainFromRequest(mockRequest);
      expect(result).toBe(null);
    });
  });

  describe("getReservedSubdomainFromRequest", () => {
    it('should return "app" when in Vercel preview', async () => {
      mockHeaders.set("host", "store-git-feature-branch-marketdotdev.vercel.app");

      const result = await domainRequestService.getReservedSubdomainFromRequest(mockRequest);
      expect(result).toBe("app");
    });

    it("should return the subdomain when it is in the reserved list", async () => {
      mockHeaders.set("host", "blog.example.com");

      const result = await domainRequestService.getReservedSubdomainFromRequest(mockRequest);
      expect(result).toBe("blog");
    });

    it("should return null when subdomain is not in the reserved list", async () => {
      mockHeaders.set("host", "username.example.com");

      const result = await domainRequestService.getReservedSubdomainFromRequest(mockRequest);
      expect(result).toBe(null);
    });
  });

  describe("getGhUsernameFromRequest", () => {
    it("should return null when in Vercel preview", async () => {
      mockHeaders.set("host", "store-git-feature-branch-marketdotdev.vercel.app");

      const result = await domainRequestService.getGhUsernameFromRequest(mockRequest);
      expect(result).toBe(null);
    });

    it("should return null when subdomain is in the reserved list", async () => {
      mockHeaders.set("host", "app.example.com");

      const result = await domainRequestService.getGhUsernameFromRequest(mockRequest);
      expect(result).toBe(null);
    });

    it("should return the subdomain as username when not reserved", async () => {
      mockHeaders.set("host", "johndoe.example.com");

      const result = await domainRequestService.getGhUsernameFromRequest(mockRequest);
      expect(result).toBe("johndoe");
    });
  });

  describe("getRootUrlFromRequest", () => {
    it("should construct the correct root URL with default path", async () => {
      mockHeaders.set("host", "example.com");

      const result = await domainRequestService.getRootUrlFromRequest(mockRequest);
      expect(result).toBe("https://example.com/");
    });

    it("should construct the correct root URL with custom path", async () => {
      mockHeaders.set("host", "example.com");

      const result = await domainRequestService.getRootUrlFromRequest(mockRequest, "/api");
      expect(result).toBe("https://example.com/api");
    });
  });
});
