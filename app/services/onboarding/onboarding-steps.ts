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

export const onboardingStepsDescription = {
    setupProject: 'Describe your project and link a Github repo. These settings apply in many places, from your website to checkout.',
    setupTiers: 'Define your service offerings and create a Tier for sale. Tiers are the building blocks of your service.',
    setupSite: 'Your site is your first sales channel. Customize it to match your brand and start selling.',
    setupPayment: 'Connect your Stripe account and you can start selling!'
}

export const onboardingStepsURLs = {
    setupProject: '/settings/project',
    setupTiers: '/services/tiers/new',
    setupSite: '/site/${siteId}/settings',
    setupPayment: '/onboarding/setup-payment'
}

export const onboardingStepsTitles = {
    setupProject: 'Setup Project',
    setupTiers: 'Define your services',
    setupSite: 'Setup your site',
    setupPayment: 'Connect Stripe'
}

const onboardingState = {} as any;

Object.values(onboardingSteps).forEach((step ) => {
    onboardingState[step] = false;
})

export const defaultOnboardingState = onboardingState as OnboardingStepsType;