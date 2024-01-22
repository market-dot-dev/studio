export type OnboardingStepsType = {
    setupTiers: boolean,
    setupSite: boolean,
    setupPayment: boolean
}

// enumerate the steps that the user needs to complete
export const onboardingSteps = {
    setupTiers: 'setupTiers',
    setupSite: 'setupSite',
    setupPayment: 'setupPayment'
}

const onboardingState = {} as any;

Object.values(onboardingSteps).forEach((step ) => {
    onboardingState[step] = false;
})

export const defaultOnboardingState = onboardingState as OnboardingStepsType;

