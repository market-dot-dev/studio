"use client";

import { Button } from "@tremor/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { deleteSite, getCurrentSite } from "@/app/services/SiteService";
import { resetState } from "@/app/services/onboarding/OnboardingService";
import { useState } from "react";
import { toast } from "sonner";

export default function RestoreOnboarding(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const currentSite = await getCurrentSite();
      if (currentSite) {
        try {
          await deleteSite(currentSite.id);
        } catch (error) {
          console.error("Error deleting store: ", error);
          toast.error("Failed to delete store");
          return;
        }
      }
      await resetState();
      toast.success("Successfully reset onboarding state");
    } catch (error) {
      toast.error("Failed to reset onboarding state");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-1/2">
      <Card className="p-6">
        <Badge variant="secondary" className="mb-1.5 me-2">
          For debugging purposes only
        </Badge>
        <h2 className="text-xl font-bold">Restore Onboarding State</h2>
        <p className="text-sm text-stone-500">User onboarding state, subdomain, location, logo will be reset to original settings at signup.</p>
        <Button
          loading={isLoading}
          onClick={handleReset}
        >
          Restore Onboarding State
        </Button>
      </Card>
    </div>
  );
}
