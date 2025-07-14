import { NextRequestWithAuth } from "next-auth/middleware";
import { NextFetchEvent, NextResponse } from "next/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SessionUser } from "./types/session";

// Mock withAuth to just return the middleware function
vi.mock("next-auth/middleware", () => ({
  withAuth: vi.fn((middlewareFn, config) => {
    // Just return the middleware function, ignore the auth wrapper
    return middlewareFn;
  })
}));

// Mock the services used by middleware
vi.mock("./app/services/site/domain-request-service", () => ({
  getGhUsernameFromRequest: vi.fn(),
  getReservedSubdomainFromRequest: vi.fn(),
  isVercelPreview: vi.fn()
}));

vi.mock("next/server", () => {
  const originalModule = vi.importActual("next/server");
  return {
    ...originalModule,
    NextResponse: {
      next: vi.fn(() => ({ type: "next" })),
      redirect: vi.fn((url) => ({ type: "redirect", url: url.toString() })),
      rewrite: vi.fn((url) => ({ type: "rewrite", url: url.toString() }))
    }
  };
});

// Import the mocked functions (after declaring)
import {
  getGhUsernameFromRequest,
  getReservedSubdomainFromRequest,
  isVercelPreview
} from "./app/services/site/domain-request-service";

function createMockRequest(
  path: string,
  host: string = "app.market.dev",
  sessionUser?: SessionUser
): NextRequestWithAuth {
  const url = new URL(`https://${host}${path}`);
  const headers = new Headers({ host });

  return {
    nextUrl: url,
    url: url.toString(),
    headers,
    cookies: {},
    nextauth: {
      token: sessionUser ? { user: sessionUser } : null
    }
  } as NextRequestWithAuth;
}

function createSessionUser(overrides: Partial<SessionUser> = {}): SessionUser {
  return {
    id: "user1",
    currentOrgId: "org1",
    ...overrides
  } as SessionUser;
}

describe("Middleware", () => {
  beforeAll(() => {
    vi.stubEnv("NEXTAUTH_SECRET", "test-secret");
  });

  beforeEach(() => {
    vi.resetAllMocks();

    // Default mocks - most requests are to app domain, not GitHub subdomains
    vi.mocked(getReservedSubdomainFromRequest).mockResolvedValue("app");
    vi.mocked(getGhUsernameFromRequest).mockResolvedValue(null);
    vi.mocked(isVercelPreview).mockResolvedValue(false);
  });

  describe("Decision 1: App domain routing", () => {
    it("should rewrite authenticated users with orgs to app directory", async () => {
      const { default: middleware } = await import("./middleware");
      const req = createMockRequest(
        "/dashboard",
        "app.market.dev",
        createSessionUser({ currentOrgId: "org1" })
      );

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.rewrite).toHaveBeenCalled();
      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/app/dashboard");
    });

    it("should redirect users with no org when accessing vendor areas", async () => {
      const { default: middleware } = await import("./middleware");
      const req = createMockRequest(
        "/dashboard",
        "app.market.dev",
        createSessionUser({ currentOrgId: undefined })
      );

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = vi.mocked(NextResponse.redirect).mock.calls[0];
      const redirectUrl = redirectCall[0] as URL;
      expect(redirectUrl.pathname).toBe("/organizations");
      expect(NextResponse.rewrite).not.toHaveBeenCalled();
    });

    it("should allow users with no org to access customer portal", async () => {
      const { default: middleware } = await import("./middleware");
      const req = createMockRequest(
        "/c/dashboard",
        "app.market.dev",
        createSessionUser({ currentOrgId: undefined })
      );

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.rewrite).toHaveBeenCalled();
      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/app/c/dashboard");
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("should allow users with no org to access organizations page", async () => {
      const { default: middleware } = await import("./middleware");
      const req = createMockRequest(
        "/organizations",
        "app.market.dev",
        createSessionUser({ currentOrgId: undefined })
      );

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.rewrite).toHaveBeenCalled();
      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/app/organizations");
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("should allow API routes to pass through on app domain", async () => {
      const { default: middleware } = await import("./middleware");
      const req = createMockRequest(
        "/api/tiers",
        "app.market.dev",
        createSessionUser({ currentOrgId: "org1" })
      );

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.rewrite).not.toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("should handle Vercel preview environments as app domain", async () => {
      vi.mocked(getReservedSubdomainFromRequest).mockResolvedValue(null);
      vi.mocked(isVercelPreview).mockResolvedValue(true);

      const { default: middleware } = await import("./middleware");
      const req = createMockRequest(
        "/dashboard",
        "store-git-main-marketdotdev.vercel.app",
        createSessionUser({ currentOrgId: "org1" })
      );

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.rewrite).toHaveBeenCalled();
      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/app/dashboard");
    });
  });

  describe("Decision 2: GitHub subdomain routing", () => {
    beforeEach(() => {
      // Not app domain for these tests
      vi.mocked(getReservedSubdomainFromRequest).mockResolvedValue(null);
      vi.mocked(isVercelPreview).mockResolvedValue(false);
    });

    it("should route GitHub usernames to maintainer-site directory", async () => {
      vi.mocked(getGhUsernameFromRequest).mockResolvedValue("johndoe");

      const { default: middleware } = await import("./middleware");
      const req = createMockRequest("/about", "johndoe.market.dev", undefined); // No auth needed for public maintainer sites

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.rewrite).toHaveBeenCalled();
      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/maintainer-site/johndoe/about");
    });

    it("should allow API routes on GitHub subdomains to pass through", async () => {
      vi.mocked(getGhUsernameFromRequest).mockResolvedValue("johndoe");

      const { default: middleware } = await import("./middleware");
      const req = createMockRequest("/api/profile", "johndoe.market.dev", undefined);

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.rewrite).not.toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });
  });

  describe("Decision 3: Bare domain routing", () => {
    beforeEach(() => {
      // Not app domain or GitHub subdomain for these tests
      vi.mocked(getReservedSubdomainFromRequest).mockResolvedValue(null);
      vi.mocked(getGhUsernameFromRequest).mockResolvedValue(null);
      vi.mocked(isVercelPreview).mockResolvedValue(false);
    });

    it("should rewrite home page to /home directory", async () => {
      const { default: middleware } = await import("./middleware");
      const req = createMockRequest("/", "market.dev", undefined); // No auth needed for public home page

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.rewrite).toHaveBeenCalled();
      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/home");
    });

    it("should redirect login paths to app subdomain", async () => {
      const { default: middleware } = await import("./middleware");
      const req = createMockRequest("/login", "market.dev", undefined); // No auth needed for login redirect

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = vi.mocked(NextResponse.redirect).mock.calls[0];
      const redirectUrl = redirectCall[0] as string;
      expect(redirectUrl).toBe("https://app.market.dev/login");
    });

    it("should rewrite terms page to /home/terms", async () => {
      const { default: middleware } = await import("./middleware");
      const req = createMockRequest("/terms", "market.dev", undefined);

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.rewrite).toHaveBeenCalled();
      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/home/terms");
    });

    it("should rewrite privacy page to /home/privacy", async () => {
      const { default: middleware } = await import("./middleware");
      const req = createMockRequest("/privacy", "market.dev", undefined);

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.rewrite).toHaveBeenCalled();
      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/home/privacy");
    });

    it("should rewrite non-home paths to app as a final fallback", async () => {
      const { default: middleware } = await import("./middleware");
      const req = createMockRequest("/some-other-path", "market.dev", undefined);

      await middleware(req, {} as NextFetchEvent);

      expect(NextResponse.rewrite).toHaveBeenCalled();
      expect(NextResponse.next).not.toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });
  });
});
