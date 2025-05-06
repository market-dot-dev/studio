import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Props {
  oauthUrl: string;
}

export function ConnectStripeBtn({ oauthUrl }: Props) {
  return (
    <Button asChild variant="outline">
      <Link href={oauthUrl}>
        <Image
          src="/stripe-icon-square.svg"
          alt="stripe logo"
          height={18}
          width={18}
          className="rounded-[3px]"
        />
        Connect your Stripe account
      </Link>
    </Button>
  );
}
