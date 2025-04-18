import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DomainService from "./domain-service";

// Mock NextRequest since we can't instantiate it directly in tests
vi.mock("next/server", () => ({
  NextRequest: vi.fn()
}));

describe("DomainService", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    // Reset and setup the mock before each test
    mockRequest = {
      nextUrl: {
        protocol: "https:"
      },
      headers: {
        get: vi.fn()
      }
    } as unknown as NextRequest;
  });

  describe("getHostnameFromRequest", () => {
    it("should return the host from request headers", () => {
      vi.mocked(mockRequest.headers.get).mockReturnValue("example.com");

      const result = DomainService.getHostnameFromRequest(mockRequest);

      expect(mockRequest.headers.get).toHaveBeenCalledWith("host");
      expect(result).toBe("example.com");
    });

    it("should return empty string when host header is not present", () => {
      vi.mocked(mockRequest.headers.get).mockReturnValue(null);

      const result = DomainService.getHostnameFromRequest(mockRequest);

      expect(result).toBe("");
    });
  });

  describe("isVercelPreview", () => {
    it("should return true for Vercel preview URLs", () => {
      vi.mocked(mockRequest.headers.get).mockReturnValue(
        "store-git-feature-branch-marketdotdev.vercel.app"
      );

      const result = DomainService.isVercelPreview(mockRequest);

      expect(result).toBe(true);
    });

    it("should return false for non-Vercel preview URLs", () => {
      vi.mocked(mockRequest.headers.get).mockReturnValue("app.example.com");

      const result = DomainService.isVercelPreview(mockRequest);

      expect(result).toBe(false);
    });
  });

  describe("getSubdomainFromRequest", () => {
    it("should return the subdomain when present", () => {
      vi.mocked(mockRequest.headers.get).mockReturnValue("blog.example.com");

      const result = DomainService.getSubdomainFromRequest(mockRequest);

      expect(result).toBe("blog");
    });

    it("should return null when no subdomain is present", () => {
      vi.mocked(mockRequest.headers.get).mockReturnValue("example.com");

      const result = DomainService.getSubdomainFromRequest(mockRequest);

      expect(result).toBe(null);
    });
  });

  describe("getReservedSubdomainFromRequest", () => {
    it('should return "app" when in Vercel preview', () => {
      vi.spyOn(DomainService, "isVercelPreview").mockReturnValue(true);

      const result = DomainService.getReservedSubdomainFromRequest(mockRequest);

      expect(result).toBe("app");
    });

    it("should return the subdomain when it is in the reserved list", () => {
      vi.spyOn(DomainService, "isVercelPreview").mockReturnValue(false);
      vi.spyOn(DomainService, "getSubdomainFromRequest").mockReturnValue("blog");

      const result = DomainService.getReservedSubdomainFromRequest(mockRequest);

      expect(result).toBe("blog");
    });

    it("should return null when subdomain is not in the reserved list", () => {
      vi.spyOn(DomainService, "isVercelPreview").mockReturnValue(false);
      vi.spyOn(DomainService, "getSubdomainFromRequest").mockReturnValue("username");

      const result = DomainService.getReservedSubdomainFromRequest(mockRequest);

      expect(result).toBe(null);
    });
  });

  describe("getGhUsernameFromRequest", () => {
    it("should return null when in Vercel preview", () => {
      vi.spyOn(DomainService, "isVercelPreview").mockReturnValue(true);

      const result = DomainService.getGhUsernameFromRequest(mockRequest);

      expect(result).toBe(null);
    });

    it("should return null when subdomain is in the reserved list", () => {
      vi.spyOn(DomainService, "isVercelPreview").mockReturnValue(false);
      vi.spyOn(DomainService, "getSubdomainFromRequest").mockReturnValue("app");

      const result = DomainService.getGhUsernameFromRequest(mockRequest);

      expect(result).toBe(null);
    });

    it("should return the subdomain as username when not reserved", () => {
      vi.spyOn(DomainService, "isVercelPreview").mockReturnValue(false);
      vi.spyOn(DomainService, "getSubdomainFromRequest").mockReturnValue("johndoe");

      const result = DomainService.getGhUsernameFromRequest(mockRequest);

      expect(result).toBe("johndoe");
    });
  });

  describe("getRootUrlFromRequest", () => {
    it("should construct the correct root URL with default path", () => {
      vi.mocked(mockRequest.headers.get).mockReturnValue("example.com");
      mockRequest.nextUrl.protocol = "https:";

      const result = DomainService.getRootUrlFromRequest(mockRequest);

      expect(result).toBe("https://example.com/");
    });

    it("should construct the correct root URL with custom path", () => {
      vi.mocked(mockRequest.headers.get).mockReturnValue("example.com");
      mockRequest.nextUrl.protocol = "https:";

      const result = DomainService.getRootUrlFromRequest(mockRequest, "/api");

      expect(result).toBe("https://example.com/api");
    });
  });
});
