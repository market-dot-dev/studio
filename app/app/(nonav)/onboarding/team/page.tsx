import { ONBOARDING_STEPS, getStepMeta } from "@/app/services/onboarding/onboarding-steps";
import { TeamMemberInviteForm } from "@/components/team/team-member-invite-form";
import { OnboardingAction } from "../onboarding-action";

export default async function TeamOnboardingPage() {
  // Get step metadata
  const stepMeta = getStepMeta(ONBOARDING_STEPS.TEAM);
  const nextPath = stepMeta?.nextPath || "/onboarding/stripe";

  return (
    <div className="mx-auto max-w-md space-y-10">
      <div className="flex flex-col items-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Invite Your Team</h1>
        <p className="text-sm text-muted-foreground">
          Invite team members to collaborate on your organization
        </p>
      </div>

      <div className="space-y-3">
        <TeamMemberInviteForm />
        <OnboardingAction
          currentStep={ONBOARDING_STEPS.TEAM}
          nextPath={nextPath}
          variant="secondary"
          continueLabel="Skip for now"
        />
      </div>
    </div>
  );
}
