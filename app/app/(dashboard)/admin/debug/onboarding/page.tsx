"use client";

import { Card, Title, Button, Badge } from "@tremor/react";
import { saveState as saveOnboardingState } from "@/app/services/onboarding/OnboardingService";
import { defaultOnboardingState } from "@/app/services/onboarding/onboarding-steps";
import { deleteSite, getCurrentSite } from "@/app/services/SiteService";

export default function RestoreOnboarding(): JSX.Element {
  return (
    <div className="w-1/2">
      <Card className="border-2 border-slate-800 bg-slate-50">
        <Badge size="xs" className="mb-1.5 me-2">
          FOR DEBUGGING PURPOSES ONLY
        </Badge>
        <Title>Restore Onboarding Guide</Title>
        <Button
          onClick={async () => {
            const currentSite = await getCurrentSite();
            if (currentSite) {
              try {
                await deleteSite(currentSite.id);
              } catch (error) {
                console.error("Error deleting site: ", error);
              }
            }
            await saveOnboardingState(defaultOnboardingState);
          }}
        >
          Restore
        </Button>
      </Card>
    </div>
  );
}
