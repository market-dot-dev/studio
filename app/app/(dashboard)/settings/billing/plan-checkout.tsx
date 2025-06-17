import { checkoutAction } from "@/app/services/platform";
import { Button } from "@/components/ui/button";

interface PlanCheckoutProps {
  priceId: string | null; // Allow null for FREE plan
}

export function PlanCheckout({ priceId }: PlanCheckoutProps) {
  // If no priceId, this is the FREE plan
  if (!priceId) {
    return (
      <Button variant="outline" className="w-full" disabled>
        Current Plan
      </Button>
    );
  }

  return (
    <form action={checkoutAction} className="mt-auto w-full">
      <input type="hidden" name="priceId" value={priceId} />
      <Button type="submit" variant="default" className="w-full">
        Upgrade to PRO
      </Button>
    </form>
  );
}
