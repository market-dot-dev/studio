import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export function StripeDashboardButton() {
  return (
    <Button asChild variant="outline" className="w-full rounded-t-none shadow-none">
      <Link href="https://dashboard.stripe.com" target="_blank" className="flex items-center gap-2">
        Go to Stripe Dashboard
        <ExternalLink className="size-3.5" />
      </Link>
    </Button>
  );
}
