import { TeamMemberInviteForm } from "@/components/team/team-member-invite-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TeamOnboardingPage() {
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

        <Button variant="secondary" className="w-full" asChild>
          <Link href="/onboarding/stripe">Skip for now</Link>
        </Button>
      </div>
    </div>
  );
}
