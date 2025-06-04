import { refreshAndGetState } from "@/app/services/onboarding/onboarding-service";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Rocket, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function createFirstTier() {
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

async function goToDashboard() {
  "use server";

  // Update the onboarding state to mark completion
  try {
    await refreshAndGetState();
  } catch (error) {
    console.error("Error updating onboarding state:", error);
  }

  // Navigate to dashboard
  redirect("/");
}

export default async function OnboardingCompletePage() {
  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="size-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome to market.dev!</h1>
        <p className="mt-2 text-sm text-stone-600">
          Your account is set up and ready to go. Here's what happens next.
        </p>
      </div>

      {/* Next Steps */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Your next step: Create your first service package</h2>

        <div className="rounded-lg border-2 border-dashed border-stone-300 p-6">
          <div className="text-center">
            <Package className="mx-auto size-12 text-stone-400" />
            <h3 className="mt-4 text-lg font-medium">Create Your First Service Package</h3>
            <p className="mt-2 text-sm text-stone-600">
              Set up a service package to start sharing your expertise and getting customers. This
              is where you'll define what you offer, set your price, and create a compelling
              description.
            </p>

            <form action={createFirstTier} className="mt-6">
              <Button type="submit">
                <Package className="mr-2 size-4" />
                Create Service Package
              </Button>
            </form>
          </div>
        </div>

        {/* What You Can Do */}
        <div className="space-y-4">
          <h3 className="font-medium text-stone-900">What you can do with service packages:</h3>

          <div className="grid gap-4">
            <div className="flex items-start space-x-3 rounded-lg border p-4">
              <Users className="mt-1 size-5 text-blue-600" />
              <div>
                <h4 className="font-medium">Attract customers</h4>
                <p className="text-sm text-stone-600">
                  Share your service packages to attract potential customers who need your
                  expertise.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 rounded-lg border p-4">
              <Rocket className="mt-1 size-5 text-green-600" />
              <div>
                <h4 className="font-medium">Generate leads</h4>
                <p className="text-sm text-stone-600">
                  Track inquiries and manage potential customers through your dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 rounded-lg border p-4">
              <CheckCircle className="mt-1 size-5 text-purple-600" />
              <div>
                <h4 className="font-medium">Close deals</h4>
                <p className="text-sm text-stone-600">
                  Convert interested prospects into paying customers with clear service offerings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Action */}
        <div className="text-center">
          <p className="mb-4 text-sm text-stone-500">Not ready to create a service package yet?</p>
          <form action={goToDashboard}>
            <Button type="submit" variant="outline">
              Explore Dashboard
            </Button>
          </form>
        </div>
      </div>

      {/* Help Text */}
      <div className="rounded-lg bg-stone-50 p-4 text-center">
        <p className="text-sm text-stone-600">
          Need help getting started? Check out our{" "}
          <Link href="/help" className="font-medium text-stone-900 underline">
            getting started guide
          </Link>{" "}
          or{" "}
          <Link href="/support" className="font-medium text-stone-900 underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
