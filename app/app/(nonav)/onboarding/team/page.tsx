import { getNextStepPath, ONBOARDING_STEPS } from "@/app/services/onboarding/onboarding-steps";
import { OnboardingAction } from "@/components/onboarding/onboarding-action";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { TeamMemberInviteFormWrapper } from "@/components/team/team-member-invite-form-wrapper";

export default async function TeamOnboardingPage() {
  const currentStep = ONBOARDING_STEPS["team"];
  const nextPath = getNextStepPath(currentStep.name);

  return (
    <div className="mx-auto max-w-md space-y-10">
      <OnboardingHeader title={currentStep.title} description={currentStep.description} />

      <div className="space-y-3">
        <TeamMemberInviteFormWrapper />
        <OnboardingAction
          currentStep={currentStep.name}
          nextPath={nextPath}
          variant="secondary"
          label="Skip for now"
        />
      </div>
    </div>
  );
}
