"use client";

import { Card, Title, Button, Badge, Text } from "@tremor/react";
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
          console.error("Error deleting site: ", error);
          toast.error("Failed to delete site");
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
      <Card className="border-2 border-slate-800 bg-slate-50">
        <Badge size="xs" className="mb-1.5 me-2">
          FOR DEBUGGING PURPOSES ONLY
        </Badge>
        <Title>Restore Onboarding State</Title>
        <Text>User onboarding state, subdomain, location, logo will be reset to original settings at signup.</Text>
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
