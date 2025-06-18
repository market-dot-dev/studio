import { Organization } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";
import {
  OrganizationCountryField,
  OrganizationDescriptionField,
  OrganizationForm,
  OrganizationFormButton,
  OrganizationFormColumn,
  OrganizationFormFields,
  OrganizationFormRow,
  OrganizationLogoField,
  OrganizationNameField,
  OrganizationSubdomainField
} from "./organization-form";

type OrganizationBusinessProps = {
  organization: {
    name: Organization["name"];
    description: Organization["description"];
    businessLocation: Organization["businessLocation"];
    subdomain?: string;
    logo?: string;
  };
};

export default function BusinessSettings({ organization }: OrganizationBusinessProps) {
  async function handleSuccess() {
    "use server";

    revalidatePath("/settings");
  }

  return (
    <div className="flex w-full items-start justify-between gap-12 lg:max-w-screen-sm">
      <OrganizationForm onSuccess={handleSuccess}>
        <OrganizationFormFields>
          <OrganizationFormRow>
            <OrganizationLogoField currentLogo={organization.logo} />
            <OrganizationFormColumn className="flex-1">
              <OrganizationNameField defaultValue={organization.name} />
              <OrganizationSubdomainField defaultValue={organization.subdomain} />
            </OrganizationFormColumn>
          </OrganizationFormRow>
          <OrganizationCountryField defaultValue={organization.businessLocation || undefined} />
          <OrganizationDescriptionField defaultValue={organization.description} />
        </OrganizationFormFields>
        <OrganizationFormButton>Save Changes</OrganizationFormButton>
      </OrganizationForm>
    </div>
  );
}
