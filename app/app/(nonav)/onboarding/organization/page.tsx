import { updateCurrentOrganizationBusiness } from "@/app/services/organization-service";
import {
  createSite,
  getCurrentSite,
  updateCurrentSite
} from "@/app/services/site/site-crud-service";
import { uploadLogo } from "@/app/services/site/site-media-service";
import { validateSubdomain } from "@/app/services/site/site-subdomain-service";
import { getCurrentOrganization, requireOrganization } from "@/app/services/user-context-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { isGitWalletError } from "@/lib/errors";
import { redirect } from "next/navigation";
import { FileUploadClient } from "./file-upload-client";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "LU", name: "Luxembourg" },
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
  { code: "NZ", name: "New Zealand" }
];

async function submitOrganizationData(formData: FormData) {
  "use server";

  const organizationName = formData.get("organizationName") as string;
  const subdomain = (formData.get("subdomain") as string)?.toLowerCase();
  const country = formData.get("country") as string;
  const logoFile = formData.get("logo") as File | null;

  // Enhanced validation
  if (!organizationName?.trim()) {
    throw new Error("Organization name is required");
  }

  if (!subdomain?.trim()) {
    throw new Error("Subdomain is required");
  }

  if (!country) {
    throw new Error("Please select a country");
  }

  try {
    // Validate subdomain first
    const currentSite = await getCurrentSite();
    await validateSubdomain(subdomain, currentSite || undefined);

    // Upload logo if provided
    let logoUrl: string | undefined;
    if (logoFile && logoFile.size > 0) {
      const logoFormData = new FormData();
      logoFormData.append("file", logoFile);
      logoUrl = await uploadLogo(logoFormData);
    }

    // Update organization business information
    await updateCurrentOrganizationBusiness({
      name: organizationName,
      businessLocation: country,
      businessType: "individual" // Default for now
    });

    // Handle site creation/update
    if (currentSite) {
      // Update existing site
      const siteFormData = new FormData();
      siteFormData.append("subdomain", subdomain);
      if (logoUrl) {
        siteFormData.append("logoURL", logoUrl);
      }
      await updateCurrentSite(siteFormData);
    } else {
      // Create new site - need organization ID
      const organization = await requireOrganization();
      await createSite(organization.id, subdomain, logoUrl);
    }
  } catch (error) {
    if (isGitWalletError(error)) {
      throw new Error(error.message);
    } else {
      console.error(error);
      throw new Error("An error occurred. Please try again.");
    }
  }

  redirect("/onboarding/team");
}

export default async function OrganizationOnboardingPage() {
  // Fetch current organization and site data for pre-filling
  const organization = await getCurrentOrganization();
  const currentSite = await getCurrentSite();

  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Create your Organization</h1>
          <p className="text-sm text-muted-foreground">
            We'll use your info to brand your dashboard and checkout links.
          </p>
        </div>

        <form action={submitOrganizationData} className="flex flex-col gap-10">
          <div className="space-y-6">
            <div className="flex flex-col gap-6 sm:flex-row">
              <FileUploadClient currentLogo={currentSite?.logo} />

              <div className="space-y-6">
                {/* Organization Name */}
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    placeholder="Your Organization Name"
                    defaultValue={organization?.name || ""}
                    required
                  />
                </div>

                {/* Domain */}
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Domain</Label>
                  <div className="flex items-center rounded bg-white shadow-border-sm">
                    <Input
                      id="subdomain"
                      name="subdomain"
                      placeholder="your-domain"
                      defaultValue={currentSite?.subdomain || ""}
                      className="rounded-r-none border-0 shadow-none"
                      required
                    />
                    <span className="inline-flex h-9 items-center border-l border-stone-200 px-3 text-sm text-stone-500 md:h-8">
                      .market.dev
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Your dashboard, checkout links, and custom landing page will be available at
                    this URL.
                  </p>
                </div>
              </div>
            </div>
            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select name="country" defaultValue={organization?.businessLocation || ""} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-stone-500">Required for billing and tax purposes.</p>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
