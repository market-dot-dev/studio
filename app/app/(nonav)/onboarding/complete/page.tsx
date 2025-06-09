import { refreshAndGetState } from "@/app/services/onboarding/onboarding-service";
import { Button } from "@/components/ui/button";
import {
  AppWindowMac,
  Code,
  DollarSign,
  Link as LinkIcon,
  Package,
  Share2,
  Store,
  WandSparkles
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
    <div className="mx-auto max-w-lg">
      <div className="space-y-8">
        {/* Success Header */}
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">You're all set!</h1>
          <p className="text-sm text-muted-foreground">Your market.dev store is ready to use</p>
        </div>

        <p className="text-sm font-medium text-muted-foreground">Here's what you should do next:</p>

        {/* Timeline Steps */}
        <div>
          {/* Step 1: Finalize Packages */}
          <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <Package className="size-5 shrink-0 text-muted-foreground" />
              <div className="my-2 h-full w-px bg-border" />
            </div>
            <div className="flex-1 space-y-1 pb-8">
              <h3 className="text-sm font-semibold">Finalize Your Packages</h3>
              <p className="text-sm text-muted-foreground">
                Update pricing, messaging, and settings like trials, annual plans, and checkout
                experience (contact form or standard checkout).
              </p>
            </div>
          </div>

          {/* Step 2: Set Up Channels */}
          <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <Share2 className="size-5 shrink-0 text-muted-foreground" />
              <div className="my-2 h-full w-px bg-border" />
            </div>
            <div className="flex-1 space-y-4 pb-8">
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-semibold">Set up your Channels</h3>
                <p className="text-sm text-muted-foreground">
                  Choose how to showcase and distribute your packages across different channels.
                </p>
              </div>

              {/* Channel Options */}
              <div className="grid gap-4 pl-2">
                <div className="flex items-start gap-3">
                  <LinkIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">Checkout Links</h4>
                    <p className="text-sm text-muted-foreground">
                      Share direct links to your package checkout pages
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AppWindowMac className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium ">Landing Page</h4>
                    <p className="text-sm text-muted-foreground">
                      Create a dedicated page to showcase all your packages
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <WandSparkles className="inline-block size-3.5  shrink-0 text-success" />
                      <p className="text-xs font-medium text-success">
                        Psst: We already generated a draft landing page based on your business
                        description!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Code className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium ">Embeds</h4>
                    <p className="text-sm text-muted-foreground">
                      Embed your packages directly on your website or blog
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Store className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium ">Developer Marketplace</h4>
                    <p className="text-sm text-muted-foreground">
                      List your packages in the market.dev marketplace
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Start Selling */}
          <div className="relative flex gap-4">
            <DollarSign className="size-5 shrink-0 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-semibold">Share Your Packages & Start Selling</h3>
              <p className="text-sm text-muted-foreground">
                Distribute your packages through your preferred channels and start accepting
                customers.
              </p>
            </div>
          </div>
        </div>

        {/* Next Step Button */}
        <div className="flex justify-center pt-4">
          <form action={finalizeTiers} className="w-full">
            <Button type="submit" className="w-full">
              Next: Finalize Packages
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
