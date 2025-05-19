import { describe, expect, it } from "vitest";
import RoleService, { Role } from "./role-service";

describe("RoleService", () => {
  describe("canViewPath", () => {
    describe("anonymous role", () => {
      it("should allow access to public paths", async () => {
        const publicPaths = [
          "/",
          "/alpha",
          "/embed/something",
          "/api/og/image",
          "/api/users/verify",
          "/api/tiers/basic",
          "/terms",
          "/privacy",
          "/home",
          "/design",
          "/alpha/login",
          "/login",
          "/legal",
          "/customer-login",
          "/login/local-auth",
          "/checkout/abc123",
          "/ecosystems",
          "/ecosystems/blockchain",
          "/experts",
          "/projects",
          "/events",
          "/organizations",
          "/trending",
          "/maintainer-site/help"
        ];

        for (const path of publicPaths) {
          expect(await RoleService.canViewPath(path, "anonymous")).toBe(true);
        }
      });

      it("should deny access to protected paths", async () => {
        const protectedPaths = [
          "/dashboard",
          "/account",
          "/maintainer",
          "/maintainer/dashboard",
          "/random/path"
        ];

        for (const path of protectedPaths) {
          expect(await RoleService.canViewPath(path, "anonymous")).toBe(false);
        }
      });

      it("should default to anonymous role when no role is provided", async () => {
        expect(await RoleService.canViewPath("/")).toBe(true);
        expect(await RoleService.canViewPath("/dashboard")).toBe(false);
      });
    });

    describe("authenticated roles", () => {
      it("should give customer access to customer areas but not maintainer paths", async () => {
        const customerRole: Role = "customer";

        // Allowed paths
        expect(await RoleService.canViewPath("/dashboard", customerRole)).toBe(true);
        expect(await RoleService.canViewPath("/account", customerRole)).toBe(true);

        // Blocked paths
        expect(await RoleService.canViewPath("/maintainer", customerRole)).toBe(false);
      });

      it("should give admin access to all paths", async () => {
        const adminRole: Role = "admin";

        // All paths allowed
        expect(await RoleService.canViewPath("/dashboard", adminRole)).toBe(true);
        expect(await RoleService.canViewPath("/account", adminRole)).toBe(true);
        expect(await RoleService.canViewPath("/maintainer", adminRole)).toBe(true);
        expect(await RoleService.canViewPath("/maintainer/dashboard", adminRole)).toBe(true);
      });
    });
  });
});
