import { customerPortalAction } from "@/app/services/platform";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function StripeCustomerPortal({ returnPath }: { returnPath?: string }) {
  return (
    <form action={customerPortalAction}>
      {returnPath && <input type="hidden" name="returnPath" value={returnPath} />}
      <Button type="submit" variant="outline" className="w-full">
        Manage subscription <ExternalLink className="size-3.5" />
      </Button>
    </form>
  );
}
