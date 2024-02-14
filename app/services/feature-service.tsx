"use server";

import prisma from "@/lib/prisma"; // Adjust the import path based on your actual Prisma setup
import { Feature } from "@prisma/client";
import UserService from "./UserService";

interface FeatureCreateAttributes {
  name?: string | null;
  uri?: string | null;
  description?: string | null;
  serviceId?: string | null;
  userId: string; // Assuming this will be provided in some way, as it's non-optional but may not come directly from the form.
}

interface AttachDetachAttributes {
  featureId: string;
  referenceId: string; // Either Tier or TierVersion ID
}

interface FeatureUpdateAttributes extends Partial<FeatureCreateAttributes> {}

class FeatureService {
  static async find(id: string) {
    return prisma.feature.findUnique({
      where: { id },
    });
  }

  static async findByTierId(tierId: string): Promise<Feature[]> {
    const tierWithFeatures = await prisma.tier.findUnique({
      where: {
        id: tierId,
      },
      include: {
        features: true,
      },
    });

    // If the tier is not found or it has no features, return an empty array
    if (!tierWithFeatures || !tierWithFeatures.features) {
      return [];
    }

    return tierWithFeatures.features;
  }

  static async findByUserId(userId: string): Promise<Feature[]> {
    const features = await prisma.feature.findMany({
      where: {
        userId,
      },
    });

    return features ? features : [];
  }

  static async findByCurrentUser(): Promise<Feature[]> {
    const user = await UserService.getCurrentUser();

    if(!user){
      throw new Error("not logged in");
    }

    const features = await prisma.feature.findMany({
      where: {
        userId: user?.id,
      },
    });

    return features ? features : [];
  }

  static async create(attributes: FeatureCreateAttributes) {
    // Ensure the required `userId` is available when a feature is created.
    if (!attributes.userId) {
      throw new Error("UserId is required to create a feature.");
    }
    
    // FIXME: try Omit<FeatureCreateAttributes, 'id'> instead of casting to any
    const attrs = attributes as any;
    attrs['id'] = undefined;

    return prisma.feature.create({
      data: attrs as FeatureCreateAttributes,
    });
  }

  static async update(id: string, attributes: FeatureUpdateAttributes) {
    return prisma.feature.update({
      where: { id },
      data: attributes,
    });
  }


  // Attach a Tier or TierVersion to a Feature
  static async attach({ featureId, referenceId }: AttachDetachAttributes, type: 'tier' | 'tierVersion') {
    if (type === 'tier') {
      return prisma.feature.update({
        where: { id: featureId },
        data: {
          tiers: {
            connect: { id: referenceId },
          },
        },
      });
    } else if (type === 'tierVersion') {
      return prisma.feature.update({
        where: { id: featureId },
        data: {
          tierVersions: {
            connect: { id: referenceId },
          },
        },
      });
    } else {
      throw new Error("Invalid type for attach operation.");
    }
  }


  // FIXME: do it in a single query
  static async attachMany({ featureIds, referenceId }: {
    featureIds: string[];
    referenceId: string; // Either Tier or TierVersion ID
  }, type: 'tier' | 'tierVersion') {
    featureIds.forEach(async (featureId) => {
      await FeatureService.attach({ featureId, referenceId }, type);
    });
  }

  static async detach({ featureId, referenceId }: AttachDetachAttributes, type: 'tier' | 'tierVersion') {
    if (type === 'tier') {
      return prisma.feature.update({
        where: { id: featureId },
        data: {
          tiers: {
            disconnect: { id: referenceId },
          },
        },
      });
    } else if (type === 'tierVersion') {
      return prisma.feature.update({
        where: { id: featureId },
        data: {
          tierVersions: {
            disconnect: { id: referenceId },
          },
        },
      });
    } else {
      throw new Error("Invalid type for detach operation.");
    }
  }
}

export const { create, find, update, attach, detach, findByTierId, findByUserId, findByCurrentUser, attachMany } = FeatureService;

export default FeatureService;