import { getCurrentSite } from "@/app/services/site/site-crud-service";
import { getCurrentOrganization } from "@/app/services/user-context-service";
import {
  OrganizationCountryField,
  OrganizationForm,
  OrganizationFormButton,
  OrganizationFormColumn,
  OrganizationFormFields,
  OrganizationFormRow,
  OrganizationLogoField,
  OrganizationNameField,
  OrganizationSubdomainField
} from "@/components/organization/organization-form";
import { redirect } from "next/navigation";

export default async function OrganizationOnboardingPage() {
  // Fetch current organization and site data for pre-filling
  const organization = await getCurrentOrganization();
  const currentSite = await getCurrentSite();

  async function handleSuccess() {
    "use server";
    redirect("/onboarding/business-description");
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Create Your Organization</h1>
          <p className="text-sm text-muted-foreground">
            We'll use your info to brand your dashboard and checkout links.
          </p>
        </div>

        <OrganizationForm onSuccess={handleSuccess}>
          <OrganizationFormFields>
            <OrganizationFormRow>
              <OrganizationLogoField currentLogo={currentSite?.logo} />
              <OrganizationFormColumn>
                <OrganizationNameField defaultValue={organization?.name || ""} />
                <OrganizationSubdomainField defaultValue={currentSite?.subdomain || ""} />
              </OrganizationFormColumn>
            </OrganizationFormRow>
            <OrganizationCountryField defaultValue={organization?.businessLocation || ""} />
          </OrganizationFormFields>
          <OrganizationFormButton>Continue</OrganizationFormButton>
        </OrganizationForm>
      </div>
    </div>
  );
}
