import * as tierService from "@/app/services/tier/tier-service";
import { getTierById } from "@/app/services/tier/tier-service";
import { beforeEach, describe, expect, it, vi } from "vitest";
// Mock the prisma client
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    },
    tier: {
      findUnique: vi.fn(),
      create: vi.fn()
    },
    $queryRaw: vi.fn()
  }
}));

// Import after mocking

describe("TierService update", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("queries by id and returns a tier if found", async () => {
    const mockUser = { id: "123", email: "aaron@graves.com" };
    const mockTier = { id: "456", userId: "123", name: "Gold" };

    // Mock the service method
    vi.spyOn(tierService, "getTierById").mockResolvedValue(mockTier);

    const retrievedTier = await getTierById("456");

    expect(retrievedTier).not.toBeNull();
    expect(retrievedTier?.userId).toEqual(mockUser.id);
    expect(retrievedTier?.name).toEqual("Gold");
  });
});
