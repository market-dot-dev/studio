import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Props extends Omit<ButtonProps, "asChild" | "children"> {
  oauthUrl: string;
}

export function ConnectStripeBtn({ oauthUrl, ...buttonProps }: Props) {
  return (
    <Button asChild variant="outline" {...buttonProps}>
      <Link href={oauthUrl}>
        <Image
          src="/stripe-icon-square.svg"
          alt="stripe logo"
          height={16}
          width={16}
          className="rounded-[3px]"
        />
        Connect your Stripe account
      </Link>
    </Button>
  );
}
