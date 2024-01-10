"use server";

import prisma from "@/lib/prisma";
import { Tier, TierFeature, TierVersion } from "@prisma/client";
// import { revalidateTag } from "next/cache";
// import { withPostAuth, withSiteAuth } from "../auth";
import { getSession } from "@/lib/auth";

/*
export const createTier = async ({ name, tagline, description, features, published }: { name: string, tagline: string | undefined, description: string | undefined, features: any[], published: boolean }) => {
	const session = await getSession();
	
    if (!session?.user.id) {
		return {
			error: "Not authenticated",
		};
	}

	// Map each feature text line to a TierFeature create operation
	const featuresData = features.filter(feature => !feature.disconnect).map(feature => ({
		where: { id: feature.id || "0" }, // If id is null, use an impossible value
		create: { content: feature.content, userId: session.user.id }
	}));

	const response = await prisma.tier.create({
		data: {
			name: name,
			...(tagline ? { tagline } : {}),
			...(description ? { description } : {}),
            published,
			userId: session.user.id,
			versions: {
				create: {
					features: {
						connectOrCreate: featuresData
					}
				}
			}
		},
		include: {
			versions: {
				include: {
					features: true
				}
			}
		}
	});

	return response;
};
*/


export const updateTier = async ({ id, versionId, name, tagline, description, features, published }: { id: string, versionId: string, name: string, tagline: string | undefined, description: string | undefined, features: any[], published: boolean }) => {
    const session = await getSession();

    if (!session?.user.id) {
        return { error: "Not authenticated" };
    }

    const featuresToDisconnect = features.filter(feature => feature.disconnect);
    const newFeatures = features.filter(feature => !feature.id && !feature.disconnect);
    const toUpdateFeatures = features.filter(feature => feature.id && !feature.disconnect);

    const updateFeaturesData = toUpdateFeatures.map(feature => {
        return {
            where: { id: feature.id },
            data: { content: feature.content },
        };
    });

    // Update Tier
    const updatedTier = await prisma.tier.update({
        where: { id },
        data: {
            name,
            ...(tagline ? { tagline } : {}),
            ...(description ? { description } : {}),
            published,
            versions: {
                update: {
                    where: { id: versionId },
                    data: {
                        features: {
                            // Disconnect features marked for disconnection
                            disconnect: featuresToDisconnect.map(feature => ({ id: feature.id })),
                            // Connect or create features
                            connectOrCreate: newFeatures.map(feature => ({
                                where: { id: feature.id || "0" }, // If id is null, use an impossible value
                                create: { content: feature.content, userId: session.user.id },
                            })),
                            updateMany: updateFeaturesData,
                        }
                    }
                }
            }
        },
    });

    return updatedTier;
    
};