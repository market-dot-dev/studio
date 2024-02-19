"use server";
// also write a little guide for the user to follow in order to create new steps
// like writing to db schema etc

import prisma from "@/lib/prisma";
import {getCurrentUserId} from "../SessionService";
import type { OnboardingStepsType } from "./onboarding-steps";
import { onboardingSteps } from "./onboarding-steps";


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
                onboarding: true
            }
        });

        return result?.onboarding;
    }
}

export default OnboardingService;

export const { saveState, getState } = OnboardingService;