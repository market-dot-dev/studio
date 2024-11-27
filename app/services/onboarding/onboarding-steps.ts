// TODO
// ADD Setup project step
// ADD 

export type OnboardingStepsType = {
    connectRepos: boolean,
    setupProject: boolean,
    setupPayment: boolean,
    setupTiers: boolean,
    setupSite: boolean,
} | null;

export type onBoardingStepKeyType = keyof OnboardingStepsType;

export type onBoardingStepType = {
    name: onBoardingStepKeyType,
    description: string,
    urls: string[],
    title: string,
}

// enumerate the steps that the user needs to complete
export const onboardingSteps = [
    {
        name: 'setupTiers',
        description: 'Define your service offerings and create a package for sale.',
        urls: ['/tiers'],
        title: 'Define Service Packages',
    },
    {
        name: 'setupPayment',
        description: 'Connect a Stripe account to start receiving payments.',
        urls: ['/settings/payment'],
        title: 'Connect Payout Account',
    },
    {
        name: 'setupSite',
        description: 'Your site is your first sales channel. Customize it to match your brand and start selling.',
        urls: [ 
            '/site/',
            '/page/'
         ],
        title: 'Build Your Site',
    },
]


const onboardingState = {} as any;

onboardingSteps.forEach((step) => {
    onboardingState[step.name] = false;
})

export const defaultOnboardingState = onboardingState as OnboardingStepsType;