"use server";

import prisma from "@/lib/prisma";
import { Tier, TierFeature, TierVersion } from "@prisma/client";
// import { revalidateTag } from "next/cache";
// import { withPostAuth, withSiteAuth } from "../auth";
import { getSession } from "@/lib/auth";

export const createTier = async ({ name, tagline, description, features }: { name: string, tagline: string | undefined, description: string | undefined, features: any[] }) => {
	const session = await getSession();
	if (!session?.user.id) {
		return {
			error: "Not authenticated",
		};
	}

	// Map each feature text line to a TierFeature create operation
	const featuresData = features.map(feature => ({
		where: { id: feature.id || "0" }, // If id is null, use an impossible value
		create: { content: feature.content, userId: session.user.id }
	}));

	const response = await prisma.tier.create({
		data: {
			name: name,
			...(tagline ? { tagline } : {}),
			...(description ? { description } : {}),
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



export const updateTier = async ({ id, versionId, name, tagline, description, features }: { id: string, versionId: string, name: string, tagline: string | undefined, description: string | undefined, features: any[] }) => {
    const session = await getSession();
    if (!session?.user.id) {
        return { error: "Not authenticated" };
    }

    return await prisma.$transaction(async (prisma) => {
        // Update Tier
        const updatedTier = await prisma.tier.update({
            where: { id },
            data: {
                name,
                ...(tagline ? { tagline } : {}),
                ...(description ? { description } : {}),
                // versions: {
                //     update: {
                //         where: { id: versionId },
                //         data: {
                //             features: {
				// 				// Disconnect all existing features from this version
				// 				set: [],
				// 			}
                //         }
                //     }
                // }
            },
        });

        // Update or create features
        for (const feature of features) {
            if (feature.id) {
                // Update existing feature
                await prisma.tierFeature.update({
                    where: { id: feature.id },
                    data: { content: feature.content },
                });
            } else {
                // Create new feature and connect it to the version
                await prisma.tierFeature.create({
                    data: {
                        content: feature.content,
                        userId: session.user.id,
                        versions: {
                            connect: { id: versionId },
                        },
                    },
                });
            }
        }

        return updatedTier;
    });
};


