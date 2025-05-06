import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Props {
  oauthUrl: string;
  className?: string;
}

export function ConnectStripeBtn({ oauthUrl, className }: Props) {
  return (
    <Button asChild variant="outline" className={className}>
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
