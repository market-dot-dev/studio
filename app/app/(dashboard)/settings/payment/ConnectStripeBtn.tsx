import { Button } from "@/components/ui/button";
import { Link2Icon } from "lucide-react";
import Link from "next/link";

interface Props {
  oauthUrl: string;
}

export function ConnectStripeBtn({ oauthUrl }: Props) {
  return (
    <Button asChild variant="outline">
      <Link href={oauthUrl}>
        Connect to Stripe <Link2Icon />
      </Link>
    </Button>
  );
}
