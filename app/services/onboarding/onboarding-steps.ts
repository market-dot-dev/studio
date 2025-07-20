export interface OnboardingStep {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly path: string;
}

export const ONBOARDING_BASE_URL = "/onboarding";
export const ONBOARDING_COMPLETE_URL = ONBOARDING_BASE_URL + "/complete";

// Reorder these steps to change their order in the onboarding flow
export const ONBOARDING_STEPS = {
  setup: {
    name: "setup",
    title: "Create Your Organization",
    description: "Set up your organization details and branding",
    path: ONBOARDING_BASE_URL + "/setup"
  },
  stripe: {
    name: "stripe",
    title: "Connect Stripe",
    description: "Set up payment processing to accept customer payments",
    path: ONBOARDING_BASE_URL + "/stripe"
  },
  team: {
    name: "team",
    title: "Invite Your Team",
    description: "Add others from your team to collaborate",
    path: ONBOARDING_BASE_URL + "/team"
  },
  pricing: {
    name: "pricing",
    title: "Choose Your Plan",
    description: "Start for free or upgrade to Pro for commission-free sales & priority support.",
    path: ONBOARDING_BASE_URL + "/pricing"
  }
} as const satisfies Record<string, OnboardingStep>;

export type OnboardingStepName = keyof typeof ONBOARDING_STEPS;

export const ONBOARDING_STEP_NAMES = Object.keys(ONBOARDING_STEPS) as OnboardingStepName[];

export type OnboardingState = {
  [K in OnboardingStepName]: {
    completed: boolean;
    completedAt?: string;
  };
} & {
  completed: boolean;
  completedAt?: string;
};

/**
 * Creates a default onboarding state with all steps set to incomplete
 */
function createDefaultOnboardingState(): OnboardingState {
  const state: any = {
    completed: false
  };

  // Dynamically add each ONBOARDING_STEPS as incomplete
  for (const stepName of Object.keys(ONBOARDING_STEPS) as OnboardingStepName[]) {
    state[stepName] = { completed: false };
  }

  return state as OnboardingState;
}

export const defaultOnboardingState = createDefaultOnboardingState();

/**
 * Gets the path for the next step in the onboarding flow
 * Returns the complete path if there's no next step
 */
export function getNextStepPath(currentStepName: OnboardingStepName) {
  const currentIndex = ONBOARDING_STEP_NAMES.indexOf(currentStepName);
  const nextStepName = ONBOARDING_STEP_NAMES[currentIndex + 1];

  if (!nextStepName) {
    return ONBOARDING_COMPLETE_URL;
  }

  return ONBOARDING_STEPS[nextStepName].path;
}

/**
 * Gets the path for the previous step in the onboarding flow
 * Returns /onboarding if there's no previous step
 */
export function getPreviousStepPath(currentStepName: OnboardingStepName) {
  const currentIndex = ONBOARDING_STEP_NAMES.indexOf(currentStepName);
  const previousStepName = ONBOARDING_STEP_NAMES[currentIndex - 1];

  if (!previousStepName) {
    return null;
  }

  return ONBOARDING_STEPS[previousStepName].path;
}

/**
 * Gets the first incomplete step in the onboarding flow
 */
export function getFirstIncompleteStep(state: OnboardingState): OnboardingStep | null {
  const firstIncompleteStepName = ONBOARDING_STEP_NAMES.find((stepName) => {
    const stepState = state[stepName];
    return stepState && !stepState.completed;
  });

  return firstIncompleteStepName ? ONBOARDING_STEPS[firstIncompleteStepName] : null;
}
