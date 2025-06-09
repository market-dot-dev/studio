import { createTier, listTiersByOrganizationIdWithCounts } from "@/app/services/tier/tier-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// Mock tier data for now - will be replaced with AI generation
const mockGeneratedTiers = [
  {
    name: "Starter",
    tagline: "Perfect for getting started",
    description: "• Basic consultation (1 hour)\n• Email support\n• Project assessment",
    price: 99,
    cadence: "once" as const,
    checkoutType: "gitwallet" as const
  },
  {
    name: "Professional",
    tagline: "Most popular for growing businesses",
    description:
      "• Full project development\n• 2 weeks of support\n• Code review included\n• Documentation provided",
    price: 299,
    cadence: "month" as const,
    checkoutType: "gitwallet" as const
  },
  {
    name: "Enterprise",
    tagline: "For complex projects and ongoing work",
    description:
      "• Unlimited revisions\n• Priority support\n• Monthly strategy calls\n• Custom integrations\n• Team training included",
    price: 599,
    cadence: "month" as const,
    checkoutType: "contact-form" as const
  }
];

type TierCardData = {
  name: string;
  tagline: string;
  description: string;
  price: number;
  cadence: "once" | "month";
  checkoutType: "gitwallet" | "contact-form";
};

async function saveTiersAsDrafts(formData: FormData) {
  "use server";

  // TODO: Save the generated tiers as drafts in the database
  console.log("Saving tiers as drafts...");

  // Continue to organization setup
  redirect("/onboarding/organization");
}

function TierLoadingCard({ delay = 0 }: { delay?: number }) {
  return (
    <Card
      className="flex size-full h-full animate-pulse flex-col justify-between p-6 pt-5 shadow-border"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-full bg-primary/5" />
        </div>
        <Skeleton className="h-14 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-3/4 bg-primary/5" />
          <Skeleton className="h-3 w-3/4 bg-primary/5" />
          <Skeleton className="h-3 w-3/4 bg-primary/5" />
        </div>
      </div>
      <Skeleton className="mt-8 h-9 w-full md:h-8" />
    </Card>
  );
}

function GeneratedTierCard({ tier }: { tier: TierCardData }) {
  const cadenceText = tier.cadence === "once" ? "" : `/${tier.cadence}`;

  return (
    <Card className="flex size-full flex-col justify-between bg-white p-6 pt-5 text-stone-900">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="mb-1 text-lg font-semibold">{tier.name}</h3>
          <p className="text-sm text-muted-foreground">{tier.tagline}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="h-fit text-4xl">
            <span className="tracking-tight">${tier.price}</span>
            {cadenceText && (
              <span className="text-base/10 font-normal text-stone-400">
                <span className="mr-px">/</span>
                {tier.cadence}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            {tier.description.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 w-full">
        <Button className="w-full disabled:opacity-100" disabled>
          {tier.checkoutType === "gitwallet" ? "Get Started" : "Get in touch"}
        </Button>
      </div>
    </Card>
  );
}

async function generateTiersFromDescription(description: string) {
  "use server";

  // Simulate generation delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const organization = await requireOrganization();

  // Create draft tiers based on mock data
  const createdTiers = [];
  for (const tierTemplate of mockGeneratedTiers) {
    try {
      const tier = await createTier({
        ...tierTemplate,
        published: false,
        revision: 0,
        contractId: "standard-msa"
      });
      createdTiers.push(tier);
    } catch (error) {
      console.error("Error creating tier:", error);
    }
  }

  return createdTiers;
}

async function TierGenerationContent() {
  const organization = await requireOrganization();

  if (!organization.description) {
    redirect("/onboarding/business-description");
  }

  // Check if tiers already exist
  const existingTiers = await listTiersByOrganizationIdWithCounts(organization.id);

  if (existingTiers.length === 0) {
    await generateTiersFromDescription(organization.description);
    const newTiers = await listTiersByOrganizationIdWithCounts(organization.id);

    return (
      <div className="relative space-y-10">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Your Packages</h1>
          <p className="text-sm text-muted-foreground">
            We've created these packages for you based on your business details. Use them as a
            starting point or make your own later.
          </p>
        </div>

        <div className="mx-auto flex max-w-screen-lg  flex-wrap justify-center gap-6">
          {newTiers.map((tier) => (
            <div key={tier.id} className="w-full max-w-[300px]">
              <GeneratedTierCard
                tier={
                  {
                    name: tier.name,
                    tagline: tier.tagline || "",
                    description: tier.description || "",
                    price: tier.price || 0,
                    cadence: tier.cadence,
                    checkoutType: tier.checkoutType
                  } as TierCardData
                }
              />
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-stone-150 py-4">
          <div className="mx-auto flex max-w-md flex-col gap-3">
            <form action={saveTiersAsDrafts}>
              <Button type="submit" className="w-full">
                <PackageCheck /> Save as drafts & continue
              </Button>
            </form>
            <Button type="submit" variant="ghost" className="w-full text-muted-foreground">
              <Link href="/onboarding/organization">I'll add my own packages later</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If tiers already exist, show them
  return (
    <div className="relative space-y-10">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Your Packages</h1>
        <p className="text-sm text-muted-foreground">
          Here are your existing packages. You can continue with these or create new ones later.
        </p>
      </div>

      <div className="mx-auto flex max-w-screen-lg  flex-wrap justify-center gap-6">
        {existingTiers.slice(0, 3).map((tier) => (
          <div key={tier.id} className="w-full max-w-[300px]">
            <GeneratedTierCard
              tier={
                {
                  name: tier.name,
                  tagline: tier.tagline || "",
                  description: tier.description || "",
                  price: tier.price || 0,
                  cadence: tier.cadence,
                  checkoutType: tier.checkoutType
                } as TierCardData
              }
            />
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-stone-150 py-4">
        <div className="mx-auto flex max-w-md flex-col gap-3">
          <form action={saveTiersAsDrafts}>
            <Button type="submit" className="w-full">
              <PackageCheck /> Save as drafts & Continue
            </Button>
          </form>
          <Button variant="ghost" className="w-full text-muted-foreground" asChild>
            <Link href="/onboarding/organization">I'll add my own packages later</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default async function GenerateTiersPage() {
  return <TierGenerationContent />;
}
