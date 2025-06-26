import { completeOnboarding } from "@/app/services/onboarding/onboarding-service";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { Button } from "@/components/ui/button";
import {
  AppWindowMac,
  Code,
  DollarSign,
  Link as LinkIcon,
  Package,
  Share2,
  Store
} from "lucide-react";
import { redirect } from "next/navigation";

async function action() {
  "use server";

  await completeOnboarding();
  redirect("/tiers");
}

export default async function OnboardingCompletePage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-8">
        <OnboardingHeader title="All Done!" description="You're ready to start selling." />

        <p className="text-sm font-medium text-muted-foreground">Here's what you should do next:</p>

        {/* Timeline Steps */}
        <div>
          {/* Step 1: Finalize Packages */}
          <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <Package className="size-5 shrink-0 text-muted-foreground" />
              <div className="my-2 h-full w-px border-l" />
            </div>
            <div className="flex-1 space-y-1 pb-8">
              <h3 className="text-sm font-semibold">Create your service packages</h3>
              <p className="text-sm text-muted-foreground">
                Set up the first packages you want to offer.
              </p>
            </div>
          </div>

          {/* Step 2: Set Up Channels */}
          <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <Share2 className="size-5 shrink-0 text-muted-foreground" />
              <div className="my-2 h-full w-px border-l" />
            </div>
            <div className="flex-1 pb-8">
              <h3 className="mb-1 text-sm font-semibold">Pick a channel</h3>
              <p className="mb-2 text-sm text-muted-foreground">
                When your packages are ready, promote them using:
              </p>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <span className="inline-flex items-baseline font-medium text-stone-700">
                  <LinkIcon className="mr-2 size-4 shrink-0 translate-y-[3px]" />
                  Checkout Links
                </span>
                <span className="inline-flex items-baseline font-medium text-stone-700">
                  <AppWindowMac className="mr-2 size-4 shrink-0 translate-y-[3px]" />
                  Landing Page
                </span>
                <span className="inline-flex items-baseline font-medium text-stone-700">
                  <Code className="mr-2 size-4 shrink-0 translate-y-[3px]" />
                  Embeds
                </span>
                <span className="inline-flex items-baseline font-medium text-stone-700">
                  <Store className="mr-2 size-4 shrink-0 translate-y-[3px]" />
                  Developer Marketplace
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Start Selling */}
          <div className="relative flex gap-4">
            <DollarSign className="size-5 shrink-0 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-semibold">Start selling</h3>
              <p className="text-sm text-muted-foreground">
                Promote your packages and watch the sales roll in.
              </p>
            </div>
          </div>
        </div>

        {/* Next Step Button */}
        <div className="flex justify-center pt-2">
          <form action={action} className="w-full">
            <Button type="submit" className="w-full">
              Next: Create my packages
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
