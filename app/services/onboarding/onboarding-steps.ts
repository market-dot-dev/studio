// TODO
// ADD Setup project step
// ADD 

import { Package, AppWindowMac, Wallet, WalletMinimal } from "lucide-react"

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
    icon: any,
}

// enumerate the steps that the user needs to complete
export const onboardingSteps = [
    {
        name: 'setupTiers',
        description: 'Define your service offerings and create a package for sale.',
        urls: ['/tiers'],
        title: 'Define Service Packages',
        icon: Package,
    },
    {
        name: 'setupPayment',
        description: 'Connect a Stripe account to start receiving payments.',
        urls: ['/settings/payment'],
        title: 'Connect Payout Account',
        icon: WalletMinimal,
    },
    {
        name: 'setupSite',
        description: 'Your site is your first sales channel. Customize it to match your brand and start selling.',
        urls: [ 
            '/site/',
            '/page/'
         ],
        title: 'Build Your Site',
        icon: AppWindowMac,
    },
    // {
    //     name: 'connectRepos',
    //     description: 'If you maintain any open sources repos, connecting repos to verify ownership.',
    //     urls: ['/settings/repos'],
    //     title: 'Connect Github Repos',
    //     icon: Github,
    // },
]

// export const onboardingStepsDescription = {
//     setupProject: 'Describe your project and link a Github repo. These settings apply in many places, from your website to checkout.',
//     setupPayment: 'Connect a payment service (we currently support Stripe) to start receiving payments.',
//     setupTiers: 'Define your service offerings and create a Tier for sale. Tiers are the building blocks of your service.',
//     setupSite: 'Your site is your first sales channel. Customize it to match your brand and start selling.',
// }

// // Update these before launch
// export const onboardingStepsURLs = {
//     setupProject: '/settings/project',
//     setupPayment: '/settings/payment',
//     setupTiers: '/features',
//     setupSite: '/site/',
// }

// export const onboardingStepsTitles = {
//     setupPayment: 'Connect Payout Account',
//     setupTiers: 'Define Services & Tiers',
//     setupProject: 'Add Project Details',
//     setupSite: 'Review your Site',
// }

const onboardingState = {} as any;

onboardingSteps.forEach((step) => {
    onboardingState[step.name] = false;
})

export const defaultOnboardingState = onboardingState as OnboardingStepsType;