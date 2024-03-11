"use server";
// also write a little guide for the user to follow in order to create new steps
// like writing to db schema etc

import prisma from "@/lib/prisma";
import {getCurrentUserId} from "../SessionService";
import { defaultOnboardingState, type OnboardingStepsType } from "./onboarding-steps";
import { projectName, projectDescription } from "@/lib/constants/site-template";


class OnboardingService {
    
    static async saveState(state: OnboardingStepsType | null ) {

        const id = await getCurrentUserId();
        if (!id) return null;

        const completed = Object.values(state ?? {}).every((step) => step === true);

        return prisma?.user.update({
            where: {
              id,
            },
            data: {
                onboarding: (state && !completed) ? JSON.stringify(state) : ''
            }
        });
    }

    static async getState() {
        const id = await getCurrentUserId();
        if (!id) return null;

        const result = await prisma?.user.findUnique({
            where: {
              id,
            },
            select: {
                onboarding: true,
                projectName: true,
                projectDescription: true,
                stripeAccountId: true,
                createdAt: true,
                // select first site
                sites: {
                    select: {
                        id: true,
                        pages: {
                            select: {
                                id: true,
                                createdAt: true,
                                updatedAt: true,
                            },
                            orderBy: {
                                createdAt: 'asc'
                            },
                            take: 2
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    },
                    take: 1
                },
                tiers: {
                    select: {
                        id: true,
                    },
                    orderBy: {
                        createdAt: 'asc'
                    },
                    take: 1
                }


            }
        });

        // Initialize the onboarding guide state
        const onboardingState = { ... defaultOnboardingState } ;

        if (!result) {
            return onboardingState;
        }

        // Check if the project setup step is done
        if (result.projectName !== projectName && result.projectDescription !== projectDescription) {
            onboardingState.setupProject = true;
        }

        // Check if the payment setup step is done
        if (result.stripeAccountId) {
            onboardingState.setupPayment = true;
        }

        // Check if at least one tier exists
        if (result.tiers && result.tiers.length > 0) {
            onboardingState.setupTiers = true;
        }

        // Check if the site setup step is done
        // The site setup is considered done if there is at least one site with more than one page,
        // or if the only page has its updatedAt date greater than createdAt date
        if (result.sites && result.sites.length > 0) {
            const site = result.sites[0];
            if (site.pages.length > 1) {
                onboardingState.setupSite = true;
            } else if (site.pages.length === 1 && new Date(site.pages[0].updatedAt) > new Date(site.pages[0].createdAt)) {
                onboardingState.setupSite = true;
            }
        }

        return onboardingState;
    }
}

export default OnboardingService;

export const { saveState, getState } = OnboardingService;