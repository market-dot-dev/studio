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
            Create some starter packages.
          </h1>
        </div>
        <div className="mb-6 flex justify-center">
          <DescriptionToTiersVisualization />
        </div>
        <BusinessDescriptionForm
          submitAction={submitBusinessDescription}
          existingDescription={organization.description || ""}
        />
      </div>
    </div>
  );
}
