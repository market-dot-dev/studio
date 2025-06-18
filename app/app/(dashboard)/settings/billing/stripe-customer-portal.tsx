import { customerPortalAction } from "@/app/services/platform";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function StripeCustomerPortal() {
  return (
    <form action={customerPortalAction}>
      <input type="hidden" name="test" value="Test" />
      <Button type="submit" className="w-full">
        Manage subscription <ExternalLink className="ml-2 size-4" />
      </Button>
    </form>
  );
}
