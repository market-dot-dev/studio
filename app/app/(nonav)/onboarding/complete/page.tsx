import { refreshAndGetState } from "@/app/services/onboarding/onboarding-service";
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

async function finalizeTiers() {
  "use server";

  // Update the onboarding state to mark completion
  try {
    await refreshAndGetState();
  } catch (error) {
    console.error("Error updating onboarding state:", error);
  }

  // Navigate to tiers creation
  redirect("/tiers");
}

export default async function OnboardingCompletePage() {
  return (
    <div className="mx-auto max-w-[490px]">
      <div className="space-y-8">
        {/* Success Header */}
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">All Done!</h1>
          <p className="text-sm text-muted-foreground">Your store is ready to use</p>
        </div>

        <p className="text-sm font-medium text-muted-foreground">Here's what you should do next:</p>

        {/* Timeline Steps */}
        <div>
          {/* Step 1: Finalize Packages */}

          {/* TODO: Replace this when we do tier genreation in onboarding */}
          {/* <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <PackageCheck className="size-5 shrink-0 text-muted-foreground" />
              <div className="my-2 h-full w-px border-l" />
            </div>
            <div className="flex-1 space-y-1 pb-8">
              <h3 className="text-sm font-semibold">Finalize your packages</h3>
              <p className="text-sm text-muted-foreground">
                Tweak you starter packages or create new ones. Customize your pricing, messaging &
                checkout experience using the{" "}
                <span className="inline-flex items-baseline font-medium text-foreground">
                  <CreditCard className="ml-px mr-1 size-4 shrink-0 translate-y-[3px] text-muted-foreground" />
                  Standard Checkout
                </span>{" "}
                or{" "}
                <span className="inline-flex items-baseline font-medium text-foreground">
                  <Mail className="ml-px mr-1 size-4 shrink-0 translate-y-[3px] text-muted-foreground" />
                  Contact Form
                </span>
                .
              </p>
            </div>
          </div> */}
          <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <Package className="size-5 shrink-0" />
              <div className="my-2 h-full w-px border-l" />
            </div>
            <div className="flex-1 space-y-1 pb-8">
              <h3 className="text-sm font-semibold">Create your service packages</h3>
              <p className="text-sm text-muted-foreground">
                Set up your first pacakages you want to offer. Pick your pricing, messaging &
                checkout experience.
              </p>
            </div>
          </div>

          {/* Step 2: Set Up Channels */}
          <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <Share2 className="size-5 shrink-0" />
              <div className="my-2 h-full w-px border-l" />
            </div>
            <div className="flex-1 space-y-1 pb-8">
              <h3 className="text-sm font-semibold">Pick a channel</h3>
              <p className="text-sm text-muted-foreground">
                Showcase your packages using{" "}
                <span className="inline-flex items-baseline font-medium text-foreground">
                  <LinkIcon className="ml-px mr-1 size-4 shrink-0 translate-y-[3px]" />
                  Checkout Links
                </span>
                ,{" "}
                <span className="inline-flex items-baseline font-medium text-foreground">
                  <AppWindowMac className="ml-px mr-1 size-4 shrink-0 translate-y-[3px]" />
                  Landing Page
                </span>
                ,{" "}
                <span className="inline-flex items-baseline font-medium text-foreground">
                  <Code className="ml-px mr-1 size-4 shrink-0 translate-y-[3px]" />
                  Embeds
                </span>{" "}
                or our{" "}
                <span className="inline-flex items-baseline font-medium text-foreground">
                  <Store className="ml-px mr-1 size-4 shrink-0 translate-y-[3px]" />
                  Developer Marketplace
                </span>
              </p>
            </div>
          </div>

          {/* Step 3: Start Selling */}
          <div className="relative flex gap-4">
            <DollarSign className="size-5 shrink-0" />
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-semibold">Start selling</h3>
              <p className="text-sm text-muted-foreground">
                Promote your packages and see the sales roll in.
              </p>
            </div>
          </div>
        </div>

        {/* Next Step Button */}
        <div className="flex justify-center pt-4">
          <form action={finalizeTiers} className="w-full">
            <Button type="submit" className="w-full">
              Next: Finalize my packages
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
