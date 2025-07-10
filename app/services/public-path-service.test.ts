import { describe, expect, it } from "vitest";
import { isPublicPath } from "./public-path-service";

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
        console.log("PATH", path);
        expect(await isPublicPath(path)).toBe(false);
      }
    });
  });
});
