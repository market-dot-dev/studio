import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";
import { NextFetchEvent, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OrganizationRole, OrganizationType } from "./app/generated/prisma";
import { canViewPath, createAuthContext } from "./app/services/organization/role-service";
import {
  getGhUsernameFromRequest,
  getReservedSubdomainFromRequest,
  getSubdomainFromRequest
} from "./app/services/site/domain-request-service";

// Mock only the dependencies
vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn()
}));

vi.mock("./app/services/domain-request-service", () => ({
  getSubdomainFromRequest: vi.fn(),
  getReservedSubdomainFromRequest: vi.fn(),
  getGhUsernameFromRequest: vi.fn(),
  isVercelPreview: vi.fn().mockResolvedValue(false)
}));

vi.mock("./app/services/role-service", () => ({
  canViewPath: vi.fn(),
  createAuthContext: vi.fn()
}));

vi.mock("./lib/domain", () => ({
  getRootUrl: vi.fn().mockReturnValue("https://app.market.dev")
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

function createMockRequest(path: string, host: string = "app.market.dev") {
  const url = new URL(`https://${host}${path}`);
  const headers = new Headers({ host });

  return {
    nextUrl: url,
    url: url.toString(),
    headers,
    cookies: {}
  } as NextRequestWithAuth;
}

const customerOrgOwner = {
  id: "user1",
  currentOrgId: "org1",
  currentOrgType: OrganizationType.CUSTOMER,
  currentUserRole: OrganizationRole.OWNER
};

const vendorOrgOwner = {
  ...customerOrgOwner,
  currentOrgType: OrganizationType.VENDOR
};

function createMockEvent() {
  return { waitUntil: vi.fn() } as unknown as NextFetchEvent;
}

describe("Middleware", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Default mocks
    vi.mocked(getSubdomainFromRequest).mockResolvedValue(null);
    vi.mocked(getReservedSubdomainFromRequest).mockResolvedValue("app");
    vi.mocked(getGhUsernameFromRequest).mockResolvedValue(null);
    vi.mocked(getToken).mockResolvedValue(null);
    vi.mocked(canViewPath).mockResolvedValue(true);
    vi.mocked(createAuthContext).mockResolvedValue({
      isAuthenticated: false
    });
  });

  describe("Customer routing", () => {
    it("should route customer org to /app/c/ paths", async () => {
      // Setup mocks for customer
      vi.mocked(getToken).mockResolvedValue({
        user: customerOrgOwner
      });

      // Import and call middleware directly
      const { default: middleware } = await import("./middleware");

      const req = createMockRequest("/dashboard");
      const event = createMockEvent();

      await middleware(req, event);

      // Should rewrite to /app/c/dashboard
      expect(NextResponse.rewrite).toHaveBeenCalled();
      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/app/c/dashboard");
    });

    it("should route customer checkout to /app/ directly", async () => {
      vi.mocked(getToken).mockResolvedValue({
        user: customerOrgOwner
      });

      const { default: middleware } = await import("./middleware");

      const req = createMockRequest("/checkout/tier123");
      const event = createMockEvent();

      await middleware(req, event);

      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/app/checkout/tier123");
    });
  });

  describe("Vendor routing", () => {
    it("should route vendor org to /app/ paths directly", async () => {
      vi.mocked(getToken).mockResolvedValue({
        user: vendorOrgOwner
      });

      const { default: middleware } = await import("./middleware");

      const req = createMockRequest("/tiers");
      const event = createMockEvent();

      await middleware(req, event);

      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/app/tiers");
    });

    it("should allow vendor access to customer area", async () => {
      vi.mocked(getToken).mockResolvedValue({
        user: vendorOrgOwner
      });

      const { default: middleware } = await import("./middleware");

      const req = createMockRequest("/c/charges");
      const event = createMockEvent();

      await middleware(req, event);

      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/app/c/charges");
    });
  });

  describe("GitHub subdomain routing", () => {
    it("should route to maintainer-site for GitHub usernames", async () => {
      vi.mocked(getGhUsernameFromRequest).mockResolvedValue("johndoe");
      vi.mocked(getReservedSubdomainFromRequest).mockResolvedValue(null);

      const { default: middleware } = await import("./middleware");

      const req = createMockRequest("/about", "johndoe.market.dev");
      const event = createMockEvent();

      await middleware(req, event);

      const rewriteCall = vi.mocked(NextResponse.rewrite).mock.calls[0];
      const rewriteUrl = rewriteCall[0] as URL;
      expect(rewriteUrl.pathname).toBe("/maintainer-site/johndoe/about");
    });
  });

  describe("Login redirects", () => {
    it("should redirect authenticated users from login pages", async () => {
      vi.mocked(getToken).mockResolvedValue({
        user: vendorOrgOwner
      });

      const { default: middleware } = await import("./middleware");

      const req = createMockRequest("/login");
      const event = createMockEvent();

      await middleware(req, event);

      expect(NextResponse.redirect).toHaveBeenCalled();
      const redirectCall = vi.mocked(NextResponse.redirect).mock.calls[0];
      const redirectUrl = redirectCall[0] as URL;
      expect(redirectUrl.pathname).toBe("/");
    });
  });

  describe("API routes", () => {
    it("should pass through API routes", async () => {
      const { default: middleware } = await import("./middleware");

      const req = createMockRequest("/api/tiers/123");
      const event = createMockEvent();

      await middleware(req, event);

      expect(NextResponse.next).toHaveBeenCalled();
    });
  });
});
