"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { LoadingPackageCard } from "@/components/onboarding/loading-package-card";
import { PackageCard } from "@/components/onboarding/package-card";
import { Spinner } from "@/components/ui/spinner";
import { useDraftPackages } from "@/hooks/use-draft-packages";
import { generatePackagesFromDescription, savePackagesAsDrafts } from "./actions";
import { RecreateDraftPackagesButton } from "./recreate-draft-packages-button";

function ErrorState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
      <AlertTriangle className="size-12 text-destructive" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          Sorry, something went wrong creating your packages, but you can make your own packages
          later.
        </p>
      </div>
      <Button asChild className="w-full">
        <Link href="/onboarding/stripe">Continue</Link>
      </Button>
    </div>
  );
}

interface DraftPackagesProps {
  organizationId: string;
  description: string;
}

export function DraftPackages({ organizationId, description }: DraftPackagesProps) {
  const { draftPackages, isLoaded, storeDraftPackages } = useDraftPackages(organizationId);
  const [isGenerating, startGeneratingTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [hasInitiatedGeneration, setHasInitiatedGeneration] = useState(false);

  const isLoading =
    !isLoaded ||
    (isLoaded && draftPackages.length === 0 && !hasInitiatedGeneration) ||
    isGenerating;

  useEffect(() => {
    if (isLoaded && draftPackages.length === 0 && !hasInitiatedGeneration) {
      setHasInitiatedGeneration(true);
      startGeneratingTransition(async () => {
        try {
          const packages = await generatePackagesFromDescription(description);
          storeDraftPackages(packages);
        } catch (e) {
          console.error("Failed to generate packages:", e);
          setError("Failed to generate packages. Please try again later.");
        }
      });
    }
  }, [
    isLoaded,
    draftPackages.length,
    description,
    storeDraftPackages,
    startGeneratingTransition,
    hasInitiatedGeneration
  ]);

  const handleSave = () => {
    startSavingTransition(async () => {
      await savePackagesAsDrafts(draftPackages);
    });
  };

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="relative space-y-10">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">
          {isLoading ? "Generating Your Packages" : "Your Draft Packages"}
        </h1>
        {isLoading ? (
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Spinner />
            <span className="text-sm ">Should take a few seconds...</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            We've created these packages for you based on your business details. Use them as a
            starting point or make your own later.
          </p>
        )}
      </div>

      <div className="mx-auto flex max-w-screen-lg flex-wrap justify-center gap-6">
        {isLoading ? (
          <>
            <LoadingPackageCard />
            <LoadingPackageCard delay={100} />
            <LoadingPackageCard delay={200} />
          </>
        ) : (
          draftPackages.map((pkg, index) => (
            <div key={index} className="w-full max-w-[300px]">
              <PackageCard pkg={pkg} />
            </div>
          ))
        )}
      </div>

      {!isLoading && (
        <div className="sticky bottom-0 bg-stone-150 py-4">
          <div className="mx-auto flex max-w-md flex-col gap-3">
            <form action={handleSave}>
              <Button
                type="submit"
                className="w-full"
                loading={isSaving}
                loadingText="Saving packages"
              >
                <PackageCheck />
                Save packages & continue
              </Button>
            </form>
            <RecreateDraftPackagesButton organizationId={organizationId} variant="secondary" />
            <Button type="submit" variant="ghost" className="w-full text-muted-foreground" asChild>
              <Link href="/onboarding/stripe">I'll add my own packages later</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
