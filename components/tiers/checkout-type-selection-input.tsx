import { TierWithFeatures } from "@/app/services/TierService";
import { Wallet, Mail } from "lucide-react";
import { User } from "@prisma/client";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function CheckoutTypeSelectionInput({
  user,
  tier,
  handleInputChange,
}: {
  user: User;
  tier: TierWithFeatures;
  handleInputChange: (key: string, value: string) => void;
}) {
  const gitwalletCheckoutEnabled = !!user.stripeAccountId;

  function GitWalletCheckout() {
    const disabled = !gitwalletCheckoutEnabled;

    const InputComponent = ({ disabled = false }: { disabled?: boolean }) => (
      <label className="flex h-full w-full transition-[background-color,box-shadow] focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-swamp">
        <div
          className={cn(
            "flex h-full w-full flex-col items-start justify-start gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border transition-[background-color,box-shadow] [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-swamp",
            disabled
              ? "border-shadow cursor-default opacity-50"
              : "border-shadow cursor-pointer hover:bg-stone-50",
          )}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Wallet className="mr-2.5 size-[18px] text-stone-500" />
              <span className="text-left text-sm font-semibold text-stone-800">
                Standard Checkout
              </span>
            </div>
            <input
              disabled={!gitwalletCheckoutEnabled}
              type="radio"
              name="checkout-type"
              value="gitwallet"
              className="border-stone-400 checked:border-swamp shadow-sm checked:text-swamp focus:outline-none focus:ring-0"
              checked={tier.checkoutType === "gitwallet"}
              onChange={(e) =>
                handleInputChange(
                  "checkoutType",
                  e.target.checked ? "gitwallet" : "contact-form",
                )
              }
            />
          </div>
          <p className="text-pretty pr-8 text-left text-xs leading-4 text-stone-500">
            Seamlessly collect and process credit card payments
          </p>
        </div>
      </label>
    );

    if (disabled) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <InputComponent disabled={true} />
            </TooltipTrigger>
            <TooltipContent>
              Connect your Stripe account in Settings to use Standard Checkout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return <InputComponent />;
  }

  return (
    <div className="flex flex-col gap-2">
      <GitWalletCheckout />
      <label className="flex h-full w-full rounded focus-within:outline-none">
        <div className="flex h-full w-full cursor-pointer flex-col gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border transition-[background-color,box-shadow] hover:bg-stone-50 [&:has(input:checked)]:border-swamp [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-swamp">
          <div className="flex h-full w-full items-center justify-between">
            <div className="flex items-center">
              <Mail className="mr-2.5 size-[18px] text-stone-500" />
              <span className="text-left text-sm font-semibold text-stone-800">
                Contact Form
              </span>
            </div>
            <input
              type="radio"
              name="checkout-type"
              value="contact-form"
              className="border-stone-400 shadow-sm checked:border-swamp checked:text-swamp focus:outline-none focus:ring-0"
              checked={tier.checkoutType === "contact-form"}
              onChange={(e) =>
                handleInputChange(
                  "checkoutType",
                  e.target.checked ? "contact-form" : "gitwallet",
                )
              }
            />
          </div>
          <span className="text-pretty pr-8 text-xs leading-4 text-stone-500">
            Collect customer information and get back to them via email
          </span>
        </div>
      </label>
    </div>
  );
}
