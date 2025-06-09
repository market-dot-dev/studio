import { requireOrganization } from "@/app/services/user-context-service";
import DescriptionToTiersVisualization from "@/components/onboarding/description-to-tiers-visualization";

import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import { submitBusinessDescription } from "./actions";
import BusinessDescriptionForm from "./business-description-form";

export default async function BusinessDescriptionPage() {
  // Fetch the organization to get any existing description
  const organization = await requireOrganization();

  return (
    <div className="mx-auto max-w-md">
      <div>
        <div className="mb-6 flex flex-col items-center text-center">
          <h1 className="mb-2 text-pretty text-2xl font-bold tracking-tight">
            Welcome to market.dev
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            You're just a few steps from getting your business set up & ready to sell.
          </p>
        </div>

        {/* Visualization Section */}
        <div className="my-8 flex flex-col items-center gap-6 rounded border bg-stone-200/50 p-4 text-center">
          <div className="flex flex-col">
            <h1 className="mb-2 text-pretty text-sm font-bold tracking-tightish">
              First, let's create some starter packages
            </h1>
            <p className="max-w-prose text-balance text-xs text-muted-foreground">
              You can write a short description of your business and we'll{" "}
              <span className="text-foreground">draft 3 service packages</span> for you to work off
              of.
            </p>
          </div>
          <DescriptionToTiersVisualization />
          <p className="mt-1 text-xs text-muted-foreground">
            <Pencil size="14" className="mr-1 inline-block -translate-y-px" /> You can edit these
            packages or make your own later.
          </p>
        </div>

        <Separator className="my-8" />

        <BusinessDescriptionForm
          submitAction={submitBusinessDescription}
          existingDescription={organization.description || ""}
        />
      </div>
    </div>
  );
}
