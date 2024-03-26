// TODO
// ADD Setup project step
// ADD 

import { Computer, Banknote, Package, Globe, Github } from "lucide-react"

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

export const onboardingStepsIcons = {
    connectRepos: Github,
    setupProject: Computer,
    setupPayment: Banknote,
    setupTiers: Package,
    setupSite: Globe,
}

// enumerate the steps that the user needs to complete
export const onboardingSteps = [
    {
        name: 'setupPayment',
        description: 'Connect a Stripe account to start receiving payments.',
        urls: ['/settings/payment'],
        title: 'Connect Payout Account',
        icon: Banknote,
    },
    {
        name: 'setupTiers',
        description: 'Define your service offerings and create a Tier for sale. Tiers are the building blocks of your service.',
        urls: ['/features', '/tiers'],
        title: 'Define Services & Tiers',
        icon: Package,
    },
    {
        name: 'connectRepos',
        description: 'Connect repositories to Gitwallet to to quickly setup your Gitwallet site & workflows with existing details about your project.',
        urls: ['/settings/repos'],
        title: 'Connect Github Repo',
        icon: Github,
    },
    {
        name: 'setupProject',
        description: 'Your project settings apply in many places, from your website to checkout.',
        urls: ['/settings/project'],
        title: 'Add Project Details',
        icon: Computer,
    },
    {
        name: 'setupSite',
        description: 'Your site is your first sales channel. Customize it to match your brand and start selling.',
        urls: [ 
            '/site/',
            '/page/'
         ],
        title: 'Review your Site',
        icon: Globe,
    
    },
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