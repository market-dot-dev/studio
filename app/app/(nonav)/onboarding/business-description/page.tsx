import { requireOrganization } from "@/app/services/user-context-service";
import DescriptionToTiersVisualization from "@/components/onboarding/description-to-tiers-visualization";

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
            Create Some Starter Packages
          </h1>
        </div>
        <div className="mb-8 flex flex-col items-center gap-4">
          <DescriptionToTiersVisualization />
          <p className="max-w-prose text-pretty text-center text-sm text-muted-foreground">
            Describe your business and{" "}
            <span className="font-medium text-foreground">we'll draft 3 service packages</span> that
            fit your expertise (you can change them & make your own later).
          </p>
        </div>
        <BusinessDescriptionForm
          submitAction={submitBusinessDescription}
          organizationId={organization.id}
          existingDescription={organization.description || ""}
        />
      </div>
    </div>
  );
}
