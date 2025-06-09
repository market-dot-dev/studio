import { requireOrganization } from "@/app/services/user-context-service";
import { submitBusinessDescription } from "./actions";
import BusinessDescriptionForm from "./business-description-form";

export default async function BusinessDescriptionPage() {
  // Fetch the organization to get any existing description
  const organization = await requireOrganization();

  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-pretty text-2xl font-bold tracking-tight">
            First, let's create your service packages
          </h1>
          <p className="text-sm text-muted-foreground">
            To get you started, we'll auto-draft{" "}
            <span className="font-semibold text-foreground">3 sell-ready packages</span> based on a
            few key details about your business.
          </p>
        </div>

        <BusinessDescriptionForm
          submitAction={submitBusinessDescription}
          existingDescription={organization.description || ""}
        />
      </div>
    </div>
  );
}
