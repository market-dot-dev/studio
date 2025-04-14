import { TierWithFeatures } from "@/app/services/TierService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { CreditCard, Mail } from "lucide-react";

export default function CheckoutTypeSelectionInput({
  user,
  tier,
  handleInputChange,
  idPrefix = ""
}: {
  user: User;
  tier: TierWithFeatures;
  handleInputChange: (key: string, value: string) => void;
  idPrefix?: string;
}) {
  const gitwalletCheckoutEnabled = !!user.stripeAccountId;

  function GitWalletCheckout() {
    const disabled = !gitwalletCheckoutEnabled;

    const InputComponent = ({ disabled = false }: { disabled?: boolean }) => (
      <label className="flex size-full transition-[background-color,box-shadow] focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-swamp">
        <div
          className={cn(
            "flex h-full w-full flex-col items-start justify-start gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border transition-[background-color,box-shadow] [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-swamp",
            disabled
              ? "border-shadow cursor-default opacity-50"
              : "border-shadow cursor-pointer hover:bg-stone-50"
          )}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="mr-2.5 size-[18px] text-stone-500" />
              <span className="text-left text-sm font-semibold text-stone-800">
                Standard Checkout
              </span>
            </div>
            <input
              id={`${idPrefix}checkout-type-gitwallet`}
              disabled={!gitwalletCheckoutEnabled}
              type="radio"
              name={`${idPrefix}checkout-type`}
              value="gitwallet"
              className="border-stone-400 shadow-sm checked:border-swamp checked:text-swamp focus:outline-none focus:ring-0"
              checked={tier.checkoutType === "gitwallet"}
              onChange={(e) =>
                handleInputChange("checkoutType", e.target.checked ? "gitwallet" : "contact-form")
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
      <label className="flex size-full rounded focus-within:outline-none">
        <div className="flex size-full cursor-pointer flex-col gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border-sm transition-[background-color,box-shadow] hover:shadow-border [&:has(input:checked)]:border-swamp [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-swamp">
          <div className="flex size-full items-center justify-between">
            <div className="flex items-center">
              <Mail className="mr-2.5 size-[18px] text-stone-500" />
              <span className="text-left text-sm font-semibold text-stone-800">Contact Form</span>
            </div>
            <input
              id={`${idPrefix}checkout-type-contact-form`}
              type="radio"
              name={`${idPrefix}checkout-type`}
              value="contact-form"
              className="border-stone-400 shadow-sm checked:border-swamp checked:text-swamp focus:outline-none focus:ring-0"
              checked={tier.checkoutType === "contact-form"}
              onChange={(e) =>
                handleInputChange("checkoutType", e.target.checked ? "contact-form" : "gitwallet")
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
