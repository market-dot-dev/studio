"use client";

import { Title, Button, Badge, Text } from "@tremor/react";
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
        <Badge size="xs" className="mb-1.5 me-2">
          FOR DEBUGGING PURPOSES ONLY
        </Badge>
        <Title>Restore Onboarding State</Title>
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
