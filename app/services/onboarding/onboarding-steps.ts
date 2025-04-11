export const defaultOnboardingState: OnboardingState = {
  connectRepos: false,
  setupProject: false,
  setupPayment: false,
  setupTiers: false,
  setupSite: false,
  setupBusiness: false,
  isDismissed: false,
};

export interface OnboardingState extends Exclude<OnboardingStepsType, null> {
  setupBusiness: boolean;
  preferredServices?: string[];
  isDismissed: boolean;
}

export type OnboardingStepsType = {
  connectRepos: boolean;
  setupProject: boolean;
  setupPayment: boolean;
  setupTiers: boolean;
  setupSite: boolean;
} | null;

type onBoardingStepKeyType = keyof Exclude<OnboardingStepsType, null>;

export type onBoardingStepType = {
  name: onBoardingStepKeyType;
  description: string;
  urls: string[];
  title: string;
};

// enumerate the steps that the user needs to complete
export const onboardingSteps: onBoardingStepType[] = [
  {
    name: "setupPayment",
    description: "Connect a Stripe account to start receiving payments.",
    urls: ["/settings/payment"],
    title: "Connect Stripe",
  },
  {
    name: "setupTiers",
    description: "Define your service offerings and create a package to sell.",
    urls: ["/tiers"],
    title: "Create a Package",
  },
  {
    name: "setupSite",
    description:
      "Your store is your first sales channel. Make it match your brand & start selling.",
    urls: ["/site/", "/page/"],
    title: "Customize your landing page",
  },
];
