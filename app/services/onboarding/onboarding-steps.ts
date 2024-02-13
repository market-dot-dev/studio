// TODO
// ADD Setup project step
// ADD 

import { Computer, Banknote, Package, Globe } from "lucide-react"

export type OnboardingStepsType = {
    setupProject: boolean,
    setupPayment: boolean,
    setupTiers: boolean,
    setupSite: boolean,
}

export const onboardingStepsIcons = {
    setupProject: Computer,
    setupPayment: Banknote,
    setupTiers: Package,
    setupSite: Globe,
}

// enumerate the steps that the user needs to complete
export const onboardingSteps = {
    setupProject: 'setupProject',
    setupPayment: 'setupPayment',
    setupTiers: 'setupTiers',
    setupSite: 'setupSite',
}

export const onboardingStepsDescription = {
    setupProject: 'Describe your project and link a Github repo. These settings apply in many places, from your website to checkout.',
    setupPayment: 'Connect a payment service (we currently support Stripe) to start receiving payments.',
    setupTiers: 'Define your service offerings and create a Tier for sale. Tiers are the building blocks of your service.',
    setupSite: 'Your site is your first sales channel. Customize it to match your brand and start selling.',
}

// Update these before launch
export const onboardingStepsURLs = {
    setupProject: '/settings/project',
    setupPayment: '/settings/payment',
    setupTiers: '/features',
    setupSite: '/site/',
}

export const onboardingStepsTitles = {
    setupProject: 'Setup Project Details',
    setupPayment: 'Connect Payment Service',
    setupTiers: 'Define your services',
    setupSite: 'Publish your site',
}

const onboardingState = {} as any;

Object.values(onboardingSteps).forEach((step ) => {
    onboardingState[step] = false;
})

export const defaultOnboardingState = onboardingState as OnboardingStepsType;