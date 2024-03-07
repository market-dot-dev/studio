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

  static async findByTierVersionId(tierVersionId: string): Promise<Feature[]> {
    const tierWithFeatures = await prisma.tierVersion.findUnique({
      where: {
        id: tierVersionId,
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

    return features || [];
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

    return features || [];
  }

  static async create(attributes: FeatureCreateAttributes) {
    // Ensure the required `userId` is available when a feature is created.
    if (!attributes.userId) {
      throw new Error("UserId is required to create a feature.");
    }
    
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

  static async attach({ featureId, referenceId }: AttachDetachAttributes, type: 'tier' | 'tierVersion') {
    return FeatureService.attachMany({ featureIds: [featureId], referenceId }, type);
  }

  static async attachMany({ featureIds, referenceId }: { featureIds: string[]; referenceId: string; }, type: 'tier' | 'tierVersion') {
    const query = {
      where: { id: referenceId },
      data: {
        features: {
          connect: featureIds.map(featureId => ({ id: featureId })),
        }
      },
    }

    return type === 'tier' ? prisma.tier.update(query) : prisma.tierVersion.update(query);
  }

  static async detachMany({ featureIds, referenceId }: { featureIds: string[]; referenceId: string; }, type: 'tier' | 'tierVersion') {
    const query = {
      where: { id: referenceId },
      data: {
        features: {
          disconnect: featureIds.map(featureId => ({ id: featureId })),
        }
      },
    }

    return type === 'tier' ? prisma.tier.update(query) : prisma.tierVersion.update(query);
  }

  static async detach({ featureId, referenceId }: AttachDetachAttributes, type: 'tier' | 'tierVersion') {
    return FeatureService.detachMany({ featureIds: [featureId], referenceId }, type);
  }

  static async setFeatureCollection(referenceId: string, featureIds: string[], type: 'tier' | 'tierVersion') {
    const isTier = type === 'tier';

    const query = {
      where: { id: referenceId },
      include: { features: true },
    };

    const features = isTier ? await FeatureService.findByTierId(referenceId) : await FeatureService.findByTierVersionId(referenceId);
  
    const existingFeatureIds = new Set(features.map(f => f.id));
    const newFeatureIds = new Set(featureIds);
  
    const featuresToAttach = [...newFeatureIds].filter(id => !existingFeatureIds.has(id));
    const featuresToDetach = [...existingFeatureIds].filter(id => !newFeatureIds.has(id));

    const operations = [];
  
    if (featuresToDetach.length > 0) {
      operations.push(FeatureService.detachMany({ referenceId, featureIds: featuresToDetach }, type));
    }
  
    if (featuresToAttach.length > 0) {
      operations.push(FeatureService.attachMany({ referenceId, featureIds: featuresToAttach }, type));
    }
  
    await Promise.all(operations);
  }

  static async haveFeatureIdsChanged(tierId: string, newFeatureIds?: string[]): Promise<boolean> {
    const currentFeatures = await FeatureService.findByTierId(tierId);
    const currentFeatureIds = new Set(currentFeatures.map(feature => feature.id));
    const newFeatureIdsSet = new Set(newFeatureIds || []);
  
    return !FeatureService.setsAreEqual(currentFeatureIds, newFeatureIdsSet);
  }
  
  static setsAreEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
    if (setA.size !== setB.size) return false;
    for (const item of setA) if (!setB.has(item)) return false;
    return true;
  }
}

export const { create, find, update, attach, detach, findByTierId, findByUserId, findByCurrentUser, attachMany, setFeatureCollection, haveFeatureIdsChanged } = FeatureService;

export default FeatureService;