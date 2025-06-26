import { getNextStepPath, ONBOARDING_STEPS } from "@/app/services/onboarding/onboarding-steps";
import { TeamMemberInviteForm } from "@/components/team/team-member-invite-form";
import { OnboardingAction } from "../onboarding-action";

export default async function TeamOnboardingPage() {
  const currentStep = ONBOARDING_STEPS["team"];
  const nextPath = getNextStepPath(currentStep.name);

  return (
    <div className="mx-auto max-w-md space-y-10">
      <div className="flex flex-col items-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">{currentStep.title}</h1>
        <p className="text-sm text-muted-foreground">{currentStep.description}</p>
      </div>

      <div className="space-y-3">
        <TeamMemberInviteForm />
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
