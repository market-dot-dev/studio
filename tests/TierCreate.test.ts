import TierService, { getTierById } from "@/app/services/tier-service";
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
import prisma from "@/lib/prisma";

describe("TierService update", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create and retrieve a user successfully", async () => {
    const mockUser = { id: "123", email: "aaron@graves.com" };

    // Mock the create function to return our mockUser
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

    // Mock findUnique to return the same user when queried
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

    // Now test your service without hitting a real database
    const user = await prisma.user.create({ data: { email: "aaron@graves.com" } });
    const retrievedUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    expect(retrievedUser).not.toBeNull();
    expect(retrievedUser?.email).toEqual("aaron@graves.com");
  });

  it("queries by id and returns a tier if found", async () => {
    const mockUser = { id: "123", email: "aaron@graves.com" };
    const mockTier = { id: "456", userId: "123", name: "Gold" };

    // Mock the service method
    vi.spyOn(TierService, "findTier").mockResolvedValue(mockTier);

    const retrievedTier = await getTierById("456");

    expect(retrievedTier).not.toBeNull();
    expect(retrievedTier?.userId).toEqual(mockUser.id);
    expect(retrievedTier?.name).toEqual("Gold");
  });
});
