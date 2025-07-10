import { OrganizationRole, OrganizationType } from "@/app/generated/prisma";
import { describe, expect, it } from "vitest";
import {
  canViewPath,
  createAuthContext,
  hasCustomerAccess,
  hasOrgAdminAccess,
  hasVendorAccess,
  isPublicPath
} from "./public-path-service";

describe("RoleService", () => {
  describe("isPublicPath", () => {
    it("should identify public paths correctly", async () => {
      const publicPaths = [
        "/",
        "/terms",
        "/privacy",
        "/home",
        "/login",
        "/app/login",
        "/maintainer-site/johndoe",
        "/maintainer-site/johndoe/about",
        "/checkout/abc123",
        "/c/contracts/contract-id"
      ];

      for (const path of publicPaths) {
        expect(await isPublicPath(path)).toBe(true);
      }
    });

    it("should identify private paths correctly", async () => {
      const privatePaths = [
        "/app",
        "/app/tiers",
        "/app/customers",
        "/app/settings",
        "/app/c",
        "/app/c/charges",
        "/app/c/settings"
      ];

      for (const path of privatePaths) {
        expect(await isPublicPath(path)).toBe(false);
      }
    });
  });

  describe("canViewPath", () => {
    describe("unauthenticated users", () => {
      it("should allow access to public paths", async () => {
        const unauthenticatedContext = await createAuthContext(false);
        const publicPaths = ["/terms", "/login", "/maintainer-site/johndoe", "/checkout/abc123"];

        for (const path of publicPaths) {
          expect(await canViewPath(path, unauthenticatedContext)).toBe(true);
        }
      });

      it("should deny access to private paths", async () => {
        const unauthenticatedContext = await createAuthContext(false);
        const privatePaths = ["/tiers", "/c", "/c/charges", "/success"];

        for (const path of privatePaths) {
          expect(await canViewPath(path, unauthenticatedContext, "app")).toBe(false);
        }
      });
    });

    describe("CUSTOMER organization on app subdomain", () => {
      it("should allow access to public paths", async () => {
        const customerContext = await createAuthContext(
          true,
          OrganizationType.CUSTOMER,
          OrganizationRole.OWNER
        );

        expect(await canViewPath("/", customerContext)).toBe(true);
        expect(await canViewPath("/terms", customerContext)).toBe(true);
      });

      it("should allow access to customer paths", async () => {
        const customerContext = await createAuthContext(
          true,
          OrganizationType.CUSTOMER,
          OrganizationRole.OWNER
        );
        const customerPaths = ["/c", "/c/charges", "/c/settings"];

        for (const path of customerPaths) {
          expect(await canViewPath(path, customerContext, "app")).toBe(true);
        }
      });

      it("should deny access to vendor dashboard paths", async () => {
        const customerContext = await createAuthContext(
          true,
          OrganizationType.CUSTOMER,
          OrganizationRole.OWNER
        );
        const vendorPaths = ["/tiers", "/customers", "/settings"];

        for (const path of vendorPaths) {
          expect(await canViewPath(path, customerContext, "app")).toBe(false);
        }
      });

      it("should allow access to shared payment paths", async () => {
        const customerContext = await createAuthContext(
          true,
          OrganizationType.CUSTOMER,
          OrganizationRole.OWNER
        );
        // /success requires auth but both org types can access it
        expect(await canViewPath("/success", customerContext, "app")).toBe(true);
      });
    });

    describe("VENDOR organization on app subdomain", () => {
      it("should allow access to public paths", async () => {
        const vendorContext = await createAuthContext(
          true,
          OrganizationType.VENDOR,
          OrganizationRole.OWNER
        );

        expect(await canViewPath("/", vendorContext)).toBe(true);
        expect(await canViewPath("/terms", vendorContext)).toBe(true);
      });

      it("should allow access to vendor dashboard paths", async () => {
        const vendorContext = await createAuthContext(
          true,
          OrganizationType.VENDOR,
          OrganizationRole.OWNER
        );
        const vendorPaths = [
          "/",
          "/tiers",
          "/customers",
          "/settings",
          "/site/site-id",
          "/contracts"
        ];

        for (const path of vendorPaths) {
          expect(await canViewPath(path, vendorContext, "app")).toBe(true);
        }
      });

      it("should allow access to customer paths (vendors can also be customers)", async () => {
        const vendorContext = await createAuthContext(
          true,
          OrganizationType.VENDOR,
          OrganizationRole.OWNER
        );
        const customerPaths = ["/c", "/c/charges", "/c/settings"];

        for (const path of customerPaths) {
          expect(await canViewPath(path, vendorContext, "app")).toBe(true);
        }
      });

      it("should allow access to shared payment paths", async () => {
        const vendorContext = await createAuthContext(
          true,
          OrganizationType.VENDOR,
          OrganizationRole.OWNER
        );
        // /success requires auth but both org types can access it
        expect(await canViewPath("/success", vendorContext, "app")).toBe(true);
      });
    });

    describe("on non-app subdomains", () => {
      it("should allow authenticated users to access any path", async () => {
        const vendorContext = await createAuthContext(
          true,
          OrganizationType.VENDOR,
          OrganizationRole.OWNER
        );
        const customerContext = await createAuthContext(
          true,
          OrganizationType.CUSTOMER,
          OrganizationRole.OWNER
        );

        const paths = ["/", "/some/path", "/any/other/path"];

        for (const path of paths) {
          expect(await canViewPath(path, vendorContext, "johndoe")).toBe(true);
          expect(await canViewPath(path, customerContext, "johndoe")).toBe(true);
          expect(await canViewPath(path, vendorContext, undefined)).toBe(true);
        }
      });
    });
  });

  describe("helper methods", () => {
    it("should correctly identify vendor access", async () => {
      const vendorContext = await createAuthContext(
        true,
        OrganizationType.VENDOR,
        OrganizationRole.OWNER
      );
      const customerContext = await createAuthContext(
        true,
        OrganizationType.CUSTOMER,
        OrganizationRole.OWNER
      );
      const unauthenticatedContext = await createAuthContext(false);

      expect(await hasVendorAccess(vendorContext)).toBe(true);
      expect(await hasVendorAccess(customerContext)).toBe(false);
      expect(await hasVendorAccess(unauthenticatedContext)).toBe(false);
    });

    it("should correctly identify customer access", async () => {
      const vendorContext = await createAuthContext(
        true,
        OrganizationType.VENDOR,
        OrganizationRole.OWNER
      );
      const customerContext = await createAuthContext(
        true,
        OrganizationType.CUSTOMER,
        OrganizationRole.OWNER
      );
      const unauthenticatedContext = await createAuthContext(false);

      expect(await hasCustomerAccess(vendorContext)).toBe(true); // Vendors can be customers too
      expect(await hasCustomerAccess(customerContext)).toBe(true);
      expect(await hasCustomerAccess(unauthenticatedContext)).toBe(false);
    });

    it("should correctly identify org admin access", async () => {
      const ownerContext = await createAuthContext(
        true,
        OrganizationType.VENDOR,
        OrganizationRole.OWNER
      );
      const adminContext = await createAuthContext(
        true,
        OrganizationType.VENDOR,
        OrganizationRole.ADMIN
      );
      const memberContext = await createAuthContext(
        true,
        OrganizationType.VENDOR,
        OrganizationRole.MEMBER
      );

      expect(await hasOrgAdminAccess(ownerContext)).toBe(true);
      expect(await hasOrgAdminAccess(adminContext)).toBe(true);
      expect(await hasOrgAdminAccess(memberContext)).toBe(false);
    });
  });
});
