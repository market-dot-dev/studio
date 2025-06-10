"use server";

import { createTier } from "@/app/services/tier/tier-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { redirect } from "next/navigation";

export type PackageData = {
  name: string;
  tagline: string;
  description: string;
  price: number;
  cadence: "once" | "month";
  checkoutType: "gitwallet" | "contact-form";
};

const mockGeneratedPackages: PackageData[] = [
  {
    name: "Starter",
    tagline: "Perfect for getting started",
    description: "Basic consultation (1 hour)\nEmail support\nProject assessment",
    price: 99,
    cadence: "once",
    checkoutType: "gitwallet"
  },
  {
    name: "Professional",
    tagline: "Most popular for growing businesses",
    description:
      "Full project development\n2 weeks of support\nCode review included\nDocumentation provided",
    price: 299,
    cadence: "month",
    checkoutType: "gitwallet"
  },
  {
    name: "Enterprise",
    tagline: "For complex projects and ongoing work",
    description:
      "Unlimited revisions\nPriority support\nMonthly strategy calls\nCustom integrations\nTeam training included",
    price: 599,
    cadence: "month",
    checkoutType: "contact-form"
  }
];

export async function generatePackagesFromDescription(description: string) {
  // Simulate generation delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("Generating packages for description: ", description.substring(0, 100) + "...");

  // In the future, this will call an AI service. For now, we return mock data.
  return mockGeneratedPackages;
}

export async function savePackagesAsDrafts(packages: PackageData[]) {
  "use server";

  const organization = await requireOrganization();

  for (const pkg of packages) {
    try {
      await createTier({
        ...pkg,
        organizationId: organization.id,
        published: false,
        revision: 0,
        contractId: "standard-msa"
      });
    } catch (error) {
      console.error("Error creating package:", error);
      // TODO: Add better error handling
    }
  }

  redirect("/onboarding/stripe");
}
