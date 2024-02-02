// TODO
// ADD Setup project step
// ADD 

export type OnboardingStepsType = {
    setupProject: boolean,
    setupTiers: boolean,
    setupSite: boolean,
    setupPayment: boolean
}

// enumerate the steps that the user needs to complete
export const onboardingSteps = {
    setupProject: 'setupProject',
    setupTiers: 'setupTiers',
    setupSite: 'setupSite',
    setupPayment: 'setupPayment'
}

const onboardingState = {} as any;

Object.values(onboardingSteps).forEach((step ) => {
    onboardingState[step] = false;
})

export const defaultOnboardingState = onboardingState as OnboardingStepsType;