// Onboarding step names
export const ONBOARDING_STEPS = {
  ORGANIZATION: "organization",
  TEAM: "team",
  STRIPE: "stripe",
  PRICING: "pricing"
} as const;

export type OnboardingStepName = (typeof ONBOARDING_STEPS)[keyof typeof ONBOARDING_STEPS];

// Individual step state
export interface OnboardingStepState {
  completed: boolean;
  completedAt?: string;
}

// Full onboarding state
export interface OnboardingState {
  [ONBOARDING_STEPS.ORGANIZATION]: OnboardingStepState;
  [ONBOARDING_STEPS.TEAM]: OnboardingStepState;
  [ONBOARDING_STEPS.STRIPE]: OnboardingStepState;
  [ONBOARDING_STEPS.PRICING]: OnboardingStepState;
  completed: boolean;
  completedAt?: string;
}

// Default state for new organizations
export const defaultOnboardingState: OnboardingState = {
  [ONBOARDING_STEPS.ORGANIZATION]: { completed: false },
  [ONBOARDING_STEPS.TEAM]: { completed: false },
  [ONBOARDING_STEPS.STRIPE]: { completed: false },
  [ONBOARDING_STEPS.PRICING]: { completed: false },
  completed: false
};

// Step metadata
export interface OnboardingStepMeta {
  name: OnboardingStepName;
  title: string;
  description: string;
  path: string;
  nextPath: string | null;
  previousPath: string | null;
}

// Define the onboarding flow
export const onboardingStepsMeta: OnboardingStepMeta[] = [
  {
    name: ONBOARDING_STEPS.ORGANIZATION,
    title: "Create Your Organization",
    description: "Set up your organization details and branding",
    path: "/onboarding/organization",
    nextPath: "/onboarding/team",
    previousPath: null
  },
  {
    name: ONBOARDING_STEPS.TEAM,
    title: "Invite Your Team",
    description: "Add team members to collaborate on your store",
    path: "/onboarding/team",
    nextPath: "/onboarding/stripe",
    previousPath: "/onboarding/organization"
  },
  {
    name: ONBOARDING_STEPS.STRIPE,
    title: "Connect Stripe",
    description: "Set up payment processing to accept customer payments",
    path: "/onboarding/stripe",
    nextPath: "/onboarding/pricing",
    previousPath: "/onboarding/team"
  },
  {
    name: ONBOARDING_STEPS.PRICING,
    title: "Choose Your Plan",
    description: "Select a pricing plan that fits your needs",
    path: "/onboarding/pricing",
    nextPath: "/onboarding/complete",
    previousPath: "/onboarding/stripe"
  }
];

// Helper functions
export function getStepMeta(stepName: OnboardingStepName): OnboardingStepMeta | undefined {
  return onboardingStepsMeta.find((step) => step.name === stepName);
}

export function getStepByPath(path: string): OnboardingStepMeta | undefined {
  return onboardingStepsMeta.find((step) => step.path === path);
}

export function isOnboardingComplete(state: OnboardingState): boolean {
  const allStepsCompleted = onboardingStepsMeta.every((step) => state[step.name].completed);

  return state.completed || allStepsCompleted;
}
