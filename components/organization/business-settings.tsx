import { VendorOrganizationSettingsForm } from "@/app/app/(dashboard)/settings/organization/vendor-organization-settings-form";
import { Organization } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";

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
      <VendorOrganizationSettingsForm organization={organization} />
    </div>
  );
}
