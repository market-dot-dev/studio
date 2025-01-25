import { TierWithFeatures } from "@/app/services/TierService";
import { Wallet, Mail } from "lucide-react";

export default function CheckoutTypeSelectionInput({
  tier,
  handleInputChange,
}: {
  tier: TierWithFeatures;
  handleInputChange: (key: string, value: string) => void;
}) {
  return (
    <div className="flex h-full gap-2">
      <label className="block w-full rounded-tremor-default focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-200">
        <div className="flex cursor-pointer flex-col gap-1 rounded-tremor-default border bg-white p-4 shadow-sm hover:bg-gray-50 [&:has(input:checked)]:border-marketing-swamp [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-marketing-swamp">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Wallet className="mr-3 h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-900">Standard Checkout</span>
            </div>
            <input
              type="radio"
              name="checkout-type"
              value="gitwallet"
              className="text-gray-500 checked:text-marketing-swamp focus:outline-none focus:ring-0"
              checked={tier.checkoutType === "gitwallet"}
              onChange={(e) =>
                handleInputChange(
                  "checkoutType",
                  e.target.checked ? "gitwallet" : "contact-form",
                )
              }
            />
          </div>
          <div className="block">
            <span className="text-xs text-gray-900">
              Seamlessly collect and process credit card payments
            </span>
          </div>
        </div>
      </label>
      <label className="block h-full w-full rounded-tremor-default focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-200">
        <div className="flex cursor-pointer flex-col gap-1 rounded-tremor-default border bg-white p-4 shadow-sm hover:bg-gray-50 [&:has(input:checked)]:border-marketing-swamp [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-marketing-swamp">
          <div className="flex h-full w-full items-center justify-between">
            <div className="flex items-center">
              <Mail className="mr-3 h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-900">Contact Form</span>
            </div>
            <input
              type="radio"
              name="checkout-type"
              value="contact-form"
              className="text-gray-500 checked:text-marketing-swamp focus:outline-none focus:ring-0"
              checked={tier.checkoutType === "contact-form"}
              onChange={(e) =>
                handleInputChange(
                  "checkoutType",
                  e.target.checked ? "contact-form" : "gitwallet",
                )
              }
            />
          </div>
          <div className="block">
            <span className="text-xs text-gray-900">
              Collect customer information and get back to them via email
            </span>
          </div>
        </div>
      </label>
    </div>
  );
}
