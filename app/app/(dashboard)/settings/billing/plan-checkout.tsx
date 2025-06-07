import { checkoutAction } from "@/app/services/platform";
import { Button } from "@/components/ui/button";

interface PlanCheckoutProps {
  priceId: string;
}

export function PlanCheckout({ priceId }: PlanCheckoutProps) {
  return (
    <form action={checkoutAction} className="mt-auto w-full">
      <input type="hidden" name="priceId" value={priceId} />
      <Button type="submit" variant="default" className="w-full">
        Choose
      </Button>
    </form>
  );
}
