import { requireOrganization } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import {
  OrganizationCountryField,
  OrganizationForm,
  OrganizationFormButton,
  OrganizationFormFields,
  OrganizationNameField
} from "@/components/organization/organization-form";
import { revalidatePath } from "next/cache";

export default async function SettingsPage() {
  const org = await requireOrganization();

  async function handleSuccess() {
    "use server";
    revalidatePath("/c/settings");
  }

  return (
    <div className="space-y-10 p-12 pt-10">
      <PageHeader title="Settings" />
      <OrganizationForm onSuccess={handleSuccess}>
        <OrganizationFormFields>
          <OrganizationNameField defaultValue={org.name} />
          <OrganizationCountryField defaultValue={org.businessLocation || undefined} />
        </OrganizationFormFields>
        <OrganizationFormButton>Save Changes</OrganizationFormButton>
      </OrganizationForm>
    </div>
  );
}
