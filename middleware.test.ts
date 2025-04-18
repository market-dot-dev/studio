import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";
import { NextFetchEvent, NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DomainService from "./app/services/domain-service";
import RoleService from "./app/services/role-service";
import { getRootUrl } from "./lib/domain";
import middleware, { config } from "./middleware";

// Mock dependencies
vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn()
}));

vi.mock("next-auth/middleware", () => ({
  withAuth: (handler: any) => handler
}));

vi.mock("./app/services/domain-service", () => ({
  default: {
    getSubdomainFromRequest: vi.fn(),
    getReservedSubdomainFromRequest: vi.fn(),
    getGhUsernameFromRequest: vi.fn(),
    isVercelPreview: vi.fn()
  }
}));

vi.mock("./app/services/role-service", () => ({
  default: {
    canViewPath: vi.fn()
  }
}));

vi.mock("./lib/domain", () => ({
  getRootUrl: vi.fn()
}));

vi.mock("next/server", () => {
  const originalModule = vi.importActual("next/server");
  return {
    ...originalModule,
    NextResponse: {
      next: vi.fn(() => ({ type: "next" })),
      redirect: vi.fn((url, options) => ({ type: "redirect", url, options })),
      rewrite: vi.fn((url) => ({ type: "rewrite", url }))
    }
  };
});

// Helper to create test requests with proper token handling
function createMockRequest(
  path: string,
  host: string = "market.dev",
  userRole: string | null = null
) {
  const url = new URL(`https://${host}${path}`);
  const headers = new Headers({
    host: host
  });

  // Create a token based on the userRole
  const token = userRole
    ? {
        user: {
          roleId: userRole
        }
      }
    : null;

  return {
    nextauth: { token },
    nextUrl: url,
    url: url.toString(),
    headers: headers,
    cookies: {}
  } as NextRequestWithAuth;
}

// Mock event object (NextFetchEvent)
function createMockEvent() {
  return {
    waitUntil: vi.fn()
  } as unknown as NextFetchEvent;
}

describe("Middleware", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Default mocks
    vi.mocked(DomainService.getSubdomainFromRequest).mockReturnValue(null);
    vi.mocked(DomainService.getReservedSubdomainFromRequest).mockReturnValue(null);
    vi.mocked(DomainService.getGhUsernameFromRequest).mockReturnValue(null);
    vi.mocked(DomainService.isVercelPreview).mockReturnValue(false);
    vi.mocked(RoleService.canViewPath).mockResolvedValue(true);
    vi.mocked(getToken).mockResolvedValue(null);
    vi.mocked(getRootUrl).mockReturnValue("https://market.dev");
  });

  afterEach(() => {
    // Reset any stubbed env variables
    vi.unstubAllEnvs();
  });

  describe("Middleware behavior", () => {
    it("should match appropriate paths", () => {
      const matcher = config.matcher[0];
      const regex = new RegExp(matcher);

      // Should match regular paths
      expect(regex.test("/some/path")).toBe(true);
      expect(regex.test("/api/auth")).toBe(true);

      // Should not match static public files
      expect(regex.test("/favicon.ico")).toBe(false);
      expect(regex.test("/robots.txt")).toBe(false);
      expect(regex.test("/sitemap.xml")).toBe(false);
    });
  });

  describe("Monitoring and verification paths", () => {
    it("should pass through monitoring paths without processing", async () => {
      const req = createMockRequest("/monitoring/health");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.rewrite).not.toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("should pass through verification API paths without processing", async () => {
      const req = createMockRequest("/api/users/verify/token");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.rewrite).not.toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });
  });

  describe("Bare domain handling", () => {
    beforeEach(() => {
      // Ensure this is a bare domain request - no subdomain
      vi.mocked(DomainService.getSubdomainFromRequest).mockReturnValue(null);
      vi.mocked(DomainService.getReservedSubdomainFromRequest).mockReturnValue(null);
      vi.mocked(DomainService.getGhUsernameFromRequest).mockReturnValue(null);
    });

    it("should allow direct access to terms and privacy pages", async () => {
      const termsReq = createMockRequest("/terms");
      const event = createMockEvent();
      await middleware(termsReq, event);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.rewrite).not.toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();

      vi.resetAllMocks();

      const privacyReq = createMockRequest("/privacy");
      await middleware(privacyReq, event);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.rewrite).not.toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("should rewrite root and home paths to /home", async () => {
      // Test root path
      const rootReq = createMockRequest("/");
      const event = createMockEvent();
      await middleware(rootReq, event);

      expect(NextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: expect.stringContaining("/home")
        })
      );

      vi.resetAllMocks();

      // Test /home path
      const homeReq = createMockRequest("/home");
      await middleware(homeReq, event);

      expect(NextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: expect.stringContaining("/home")
        })
      );
    });

    it("should redirect other paths to explore subdomain in production", async () => {
      // Use stubEnv instead of mocking the module
      vi.stubEnv("NODE_ENV", "production");

      const req = createMockRequest("/some-other-path");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        "https://explore.market.dev/some-other-path",
        expect.any(Object)
      );
    });

    it("should redirect other paths to explore subdomain in development", async () => {
      vi.stubEnv("NODE_ENV", "development");

      const req = createMockRequest("/some-other-path");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        "http://localhost:4000/some-other-path",
        expect.any(Object)
      );
    });

    it("should handle query parameters in redirects", async () => {
      vi.stubEnv("NODE_ENV", "production");

      const url = new URL("https://market.dev/path");
      url.searchParams.set("foo", "bar");
      const req = {
        nextUrl: url,
        url: url.toString(),
        headers: new Headers({ host: "market.dev" }),
        nextauth: { token: null }
      } as NextRequestWithAuth;
      const event = createMockEvent();

      await middleware(req, event);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        "https://explore.market.dev/path?foo=bar",
        expect.any(Object)
      );
    });
  });

  describe("GitHub username subdomain handling", () => {
    beforeEach(() => {
      vi.mocked(DomainService.getGhUsernameFromRequest).mockReturnValue("testuser");
      vi.mocked(DomainService.getSubdomainFromRequest).mockReturnValue("testuser");
      vi.mocked(DomainService.getReservedSubdomainFromRequest).mockReturnValue(null);
    });

    it("should pass through API requests on GitHub subdomains", async () => {
      const req = createMockRequest("/api/some-endpoint", "testuser.market.dev");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.rewrite).not.toHaveBeenCalled();
    });

    it("should rewrite non-API paths to maintainer site path", async () => {
      const req = createMockRequest("/some-path", "testuser.market.dev");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: expect.stringContaining("/maintainer-site/testuser/some-path")
        })
      );
    });

    it("should include query parameters in rewrites", async () => {
      const url = new URL("https://testuser.market.dev/path");
      url.searchParams.set("foo", "bar");
      const req = {
        nextUrl: url,
        url: url.toString(),
        headers: new Headers({ host: "testuser.market.dev" }),
        nextauth: { token: null }
      } as NextRequestWithAuth;

      vi.mocked(DomainService.getGhUsernameFromRequest).mockReturnValue("testuser");
      const event = createMockEvent();

      await middleware(req, event);

      expect(NextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: expect.stringContaining("/maintainer-site/testuser/path"),
          search: expect.stringContaining("foo=bar")
        })
      );
    });
  });

  // @TODO: The subdomain testing/handling requires a bit of love
  describe("App subdomain handling", () => {
    beforeEach(() => {
      vi.mocked(DomainService.getReservedSubdomainFromRequest).mockReturnValue("app");
      vi.mocked(DomainService.getSubdomainFromRequest).mockReturnValue("app");
    });

    it("should rewrite paths to /app/ for regular users", async () => {
      const req = createMockRequest("/dashboard", "app.market.dev", "user");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: expect.stringContaining("/app/dashboard")
        })
      );
    });

    it("should rewrite paths to /app/c/ for customer role", async () => {
      const req = createMockRequest("/dashboard", "app.market.dev", "customer");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: expect.stringContaining("/app/c/dashboard")
        })
      );
    });

    it("should allow checkout paths for customers without /c/ prefix", async () => {
      const req = createMockRequest("/checkout/plan", "app.market.dev", "customer");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: expect.stringContaining("/app/checkout/plan")
        })
      );
      expect(NextResponse.rewrite).not.toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: expect.stringContaining("/app/c/checkout/plan")
        })
      );
    });

    it("should redirect non-customers to root for customer-specific paths", async () => {
      vi.mocked(getRootUrl).mockReturnValue("https://app.market.dev");
      const req = createMockRequest("/charges", "app.market.dev", "user");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        "https://app.market.dev/c/charges",
        undefined
      );
    });

    it("should pass through API requests", async () => {
      const req = createMockRequest("/api/endpoint", "app.market.dev", "user");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.rewrite).not.toHaveBeenCalled();
    });
  });

  describe("Login redirects", () => {
    it("should redirect signed-in users away from login pages", async () => {
      vi.mocked(DomainService.getReservedSubdomainFromRequest).mockReturnValue("app");
      const req = createMockRequest("/login", "app.market.dev", "user");
      const event = createMockEvent();
      await middleware(req, event);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/"
        }),
        undefined
      );
    });
  });

  describe("Authorization handling", () => {
    it("should bypass role checks for site subdomains", async () => {
      // Setup a site subdomain
      vi.mocked(DomainService.getSubdomainFromRequest).mockReturnValue("testuser");
      vi.mocked(DomainService.getReservedSubdomainFromRequest).mockReturnValue(null);

      // This middleware test verifies that role checks are bypassed for site subdomains
      const req = createMockRequest("/some-path", "testuser.market.dev");
      const event = createMockEvent();
      await middleware(req, event);

      // Should rewrite without calling canViewPath
      expect(NextResponse.rewrite).toHaveBeenCalled();
      expect(RoleService.canViewPath).not.toHaveBeenCalled();
    });
  });
});
