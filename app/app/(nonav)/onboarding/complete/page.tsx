import { refreshAndGetState } from "@/app/services/onboarding/onboarding-service";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Code,
  Globe,
  Link as LinkIcon,
  Package,
  Settings,
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
  redirect("/tiers/new");
}

export default async function OnboardingCompletePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-8">
        {/* Success Header */}
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">You're all set!</h1>
          <p className="text-sm text-muted-foreground">Your market.dev store is ready to use</p>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-8">
          {/* Step 1: Finalize Packages */}
          <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex size-10 items-center justify-center rounded-full border-2 bg-white">
                <Package className="size-5 text-blue-600" />
              </div>
              <div className="h-full w-0.5 bg-gray-200" />
            </div>
            <div className="flex-1 space-y-2 pb-8">
              <h3 className="text-lg font-semibold">Finalize Your Packages</h3>
              <p className="text-sm text-muted-foreground">
                Update pricing, messaging, and settings like trials, annual plans, and checkout
                experience (contact form or standard checkout).
              </p>
            </div>
          </div>

          {/* Step 2: Set Up Channels */}
          <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex size-10 items-center justify-center rounded-full border-2 bg-white">
                <Share2 className="size-5 text-green-600" />
              </div>
              <div className="h-full w-0.5 bg-gray-200" />
            </div>
            <div className="flex-1 space-y-6 pb-8">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Set Up Your Channels</h3>
                <p className="text-sm text-muted-foreground">
                  Choose how to showcase and distribute your packages across different channels.
                </p>
              </div>

              {/* Channel Options */}
              <div className="grid gap-4 pl-4">
                <div className="flex items-start gap-3">
                  <LinkIcon className="mt-1 size-4 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Checkout Links</h4>
                    <p className="text-sm text-muted-foreground">
                      Share direct links to your package checkout pages
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="mt-1 size-4 text-purple-500" />
                  <div>
                    <h4 className="font-medium">Landing Page</h4>
                    <p className="text-sm text-muted-foreground">
                      Create a dedicated page to showcase all your packages
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Code className="mt-1 size-4 text-orange-500" />
                  <div>
                    <h4 className="font-medium">Embeds</h4>
                    <p className="text-sm text-muted-foreground">
                      Embed your packages directly on your website or blog
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Store className="mt-1 size-4 text-emerald-500" />
                  <div>
                    <h4 className="font-medium">Marketplace</h4>
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
            <div className="flex flex-col items-center">
              <div className="flex size-10 items-center justify-center rounded-full border-2 bg-white">
                <Settings className="size-5 text-indigo-600" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold">Share Your Packages & Start Selling</h3>
              <p className="text-sm text-muted-foreground">
                Distribute your packages through your preferred channels and start accepting
                customers.
              </p>
            </div>
          </div>
        </div>

        {/* Next Step Button */}
        <div className="flex justify-center pt-4">
          <form action={finalizeTiers}>
            <Button type="submit" size="lg">
              Finalize My Packages
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
