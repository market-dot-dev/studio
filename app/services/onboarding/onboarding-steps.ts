// TODO
// ADD Setup project step
// ADD 

import { Computer, Banknote, Package, Globe, Github, Waves, Circle, CircleDot, Volume2 } from "lucide-react"

export type OnboardingStepsType = {
    welcome: boolean,
    connectRepos: boolean,
    setupProject: boolean,
    setupPayment: boolean,
    setupTiers: boolean,
    setupSite: boolean,
    setupMarketing: boolean,
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
    setupMarketing: Volume2
}

// enumerate the steps that the user needs to complete
export const onboardingSteps = [
    {
        name: 'welcome',
        description: 'This guide will walk through setting up a website, building packages to sell.',
        urls: [],
        title: 'Welcome to Gitwallet',
        icon: CircleDot,
    },
    {
        name: 'setupSite',
        description: 'Your site is your first sales channel. Customize it to match your brand and start selling.',
        urls: [ 
            '/site/',
            '/page/'
         ],
        title: 'Build Your Site',
        icon: Globe,
    },
    {
        name: 'setupTiers',
        description: 'Define your service offerings and create a package for sale.',
        urls: ['/tiers'],
        title: 'Define Service Packages',
        icon: Package,
    },
    {
        name: 'setupProject',
        description: 'Your business settings apply in many places, from your website to checkout.',
        urls: ['/settings/project'],
        title: 'Provide Business Details',
        icon: Computer,
    },
    {
        name: 'connectRepos',
        description: 'If you maintain any open sources repos, connecting repos to verify ownership.',
        urls: ['/settings/repos'],
        title: 'Connect Github Repos',
        icon: Github,
    },
    {
        name: 'setupMarketing',
        description: 'Set up marketing channels to promote your services and reach potential customers.',
        urls: ['/channels/embeds'],
        title: 'Setup Marketing',
        icon: Volume2,
    },
    {
        name: 'setupPayment',
        description: 'Connect a Stripe account to start receiving payments.',
        urls: ['/settings/payment'],
        title: 'Connect Payout Account',
        icon: Banknote,
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