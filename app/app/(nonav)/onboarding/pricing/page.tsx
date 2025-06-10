import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";
import { redirect } from "next/navigation";

const features = [
  "Offer subscriptions & one-time sales",
  "Custom market.dev domain",
  "Prospect & customer CRM",
  "Sales analytics dashboard",
  "Beautiful checkout pages",
  "Contract library access",
  "Customizable embeds",
  "Custom landing page",
  "Lead capture forms"
];

async function handlePlanSubmission(formData: FormData) {
  "use server";

  const selectedPlan = formData.get("plan") as string;
  console.log(`Selected plan: ${selectedPlan}`);

  // TODO: Save the selected plan to the organization

  // Continue to completion
  redirect("/onboarding/complete");
}

export default async function PricingPage() {
  return (
    <div className="relative space-y-10">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Finally, Choose Your Plan</h1>
        <p className="text-sm text-muted-foreground">
          Start for free or upgrade to Pro for commission-free sales & priority support.
        </p>
      </div>

      <form action={handlePlanSubmission} className="space-y-6">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6 md:flex-nowrap">
          {/* Free Plan */}
          <div className="relative w-full max-w-[400px]">
            <label className="cursor-pointer">
              <Card className="shadow-border transition-shadow hover:shadow-border-lg [&:has(input:checked)]:shadow-border-lg [&:has(input:checked)]:ring-4 [&:has(input:checked)]:ring-swamp">
                <div className="px-6 pb-6 pt-5">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Free</h3>
                    <input
                      type="radio"
                      name="plan"
                      value="free"
                      defaultChecked
                      className="border-stone-400 transition-colors  checked:border-swamp checked:text-swamp checked:shadow-sm focus:outline-none focus:ring-0"
                    />
                  </div>

                  <p className="mb-6 text-sm text-muted-foreground">
                    For freelancers just getting started
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold tracking-tight">$0</span>
                      <span className="text-base text-muted-foreground">/mo</span>
                    </div>
                  </div>

                  <div className="mb-6 flex items-start gap-2">
                    <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      $0.25 transaction fee + 1% per sale
                    </p>
                  </div>

                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-success" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </label>
          </div>

          {/* Pro Plan */}
          <div className="relative w-full max-w-[400px]">
            <label className="cursor-pointer">
              <Card className="shadow-border transition-shadow hover:shadow-border-lg [&:has(input:checked)]:shadow-border-lg [&:has(input:checked)]:ring-4 [&:has(input:checked)]:ring-swamp">
                <div className="px-6 pb-6 pt-5">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Pro</h3>
                    <input
                      type="radio"
                      name="plan"
                      value="pro"
                      className="border-stone-400 transition-colors  checked:border-swamp checked:text-swamp checked:shadow-sm focus:outline-none focus:ring-0"
                    />
                  </div>

                  <p className="mb-6 text-sm text-muted-foreground">
                    For established freelances & dev shops
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold tracking-tight">$40</span>
                      <span className="text-base text-muted-foreground">/mo</span>
                    </div>
                  </div>

                  <div className="mb-6 flex items-start gap-2">
                    <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      $0.25 transaction fee, 0% commission fee
                    </p>
                  </div>

                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-success" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-stone-150 py-4 md:static">
          <div className="mx-auto flex max-w-md flex-col gap-3">
            <Button type="submit" className="w-full">
              Continue & Finish
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
