import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";
import { NextFetchEvent, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OrganizationType } from "./app/generated/prisma";
import { SessionUser } from "./app/models/Session";
import {
  getGhUsernameFromRequest,
  getReservedSubdomainFromRequest,
  getSubdomainFromRequest
} from "./app/services/domain-request-service";
import { canViewPath, createAuthContext } from "./app/services/role-service";
import middleware from "./middleware";

// Mock dependencies
vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn()
}));

vi.mock("next-auth/middleware", () => ({
  withAuth: (handler: any) => handler
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

// Helper to create test requests
function createMockRequest(
  path: string,
  host: string = "app.market.dev",
  sessionUser?: Partial<SessionUser>
) {
  const url = new URL(`https://${host}${path}`);
  const headers = new Headers({ host });

  const token = sessionUser ? { user: sessionUser } : null;

  return {
    nextauth: { token },
    nextUrl: url,
    url: url.toString(),
    headers,
    cookies: {}
  } as NextRequestWithAuth;
}

function createMockEvent() {
  return { waitUntil: vi.fn() } as unknown as NextFetchEvent;
}

describe("Middleware Authorization", () => {
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

  describe("withAuth authorized callback", () => {
    it("should allow access to site subdomains", async () => {
      vi.mocked(getSubdomainFromRequest).mockResolvedValue("johndoe");
      vi.mocked(getReservedSubdomainFromRequest).mockResolvedValue(null);

      const req = createMockRequest("/some-path", "johndoe.market.dev");
      const event = createMockEvent();

      await middleware(req, event);

      // Should not call canViewPath for site subdomains
      expect(canViewPath).not.toHaveBeenCalled();
    });

    it("should check permissions for app subdomain", async () => {
      const sessionUser = {
        id: "user1",
        currentOrgType: OrganizationType.CUSTOMER,
        currentUserRole: "OWNER"
      };

      vi.mocked(getToken).mockResolvedValue({ user: sessionUser });

      const req = createMockRequest("/dashboard", "app.market.dev", sessionUser);
      const event = createMockEvent();

      await middleware(req, event);

      expect(createAuthContext).toHaveBeenCalledWith(
        true, // isAuthenticated
        OrganizationType.CUSTOMER, // organizationType
        "OWNER" // userRole
      );
      expect(canViewPath).toHaveBeenCalledWith(
        "/dashboard",
        expect.any(Object), // authContext
        "app" // subdomain
      );
    });
  });

  describe("Organization-based routing", () => {
    it("should route customers to /app/c/ paths", async () => {
      const req = createMockRequest("/dashboard", "app.market.dev", {
        currentOrgType: OrganizationType.CUSTOMER
      });
      const event = createMockEvent();

      await middleware(req, event);

      expect(NextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: expect.stringContaining("/app/c/dashboard")
        })
      );
    });

    it("should allow customers access to payment flows", async () => {
      const req = createMockRequest("/checkout/tier-id", "app.market.dev", {
        currentOrgType: OrganizationType.CUSTOMER
      });
      const event = createMockEvent();

      await middleware(req, event);

      expect(NextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: expect.stringContaining("/app/checkout/tier-id")
        })
      );
    });

    it("should give vendors full access to /app/ paths", async () => {
      const req = createMockRequest("/tiers", "app.market.dev", {
        currentOrgType: OrganizationType.VENDOR
      });
      const event = createMockEvent();

      await middleware(req, event);

      expect(NextResponse.rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: expect.stringContaining("/app/tiers")
        })
      );
    });
  });

  describe("Login redirects", () => {
    it("should redirect authenticated users away from login pages", async () => {
      const req = createMockRequest("/login", "app.market.dev", { id: "user1" });
      const event = createMockEvent();

      vi.mocked(getToken).mockResolvedValue({ user: { id: "user1" } });

      await middleware(req, event);

      expect(NextResponse.redirect).toHaveBeenCalled();
    });
  });
});
