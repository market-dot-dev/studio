import { Channel } from "@prisma/client";
import { Store, ShoppingBag } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function ChannelsSelectionInput({
  selectedChannels,
  handleInputChange,
  userIsMarketExpert,
  idPrefix = "",
}: {
  selectedChannels: Channel[];
  handleInputChange: (channel: Channel) => void;
  userIsMarketExpert: boolean;
  idPrefix?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="block w-full focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-200">
        <div className="flex h-full w-full cursor-pointer flex-col gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border transition-[background-color,box-shadow] hover:bg-stone-50 [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-marketing-swamp">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Store className="mr-2.5 size-[18px] text-stone-500" />
              <span className="text-left text-sm font-semibold text-stone-800">
                Storefront
              </span>
            </div>
            <Checkbox
              id={`${idPrefix}channel-site`}
              name={`${idPrefix}channel-type`}
              value={Channel.site}
              checked={selectedChannels.includes(Channel.site)}
              onCheckedChange={() => handleInputChange(Channel.site)}
            />
          </div>
          <p className="text-left text-xs leading-4 text-stone-500">
            List your package for sale on your website
          </p>
        </div>
      </label>
      {userIsMarketExpert && (
        <label className="block h-full w-full focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-200">
          <div className="flex h-full w-full cursor-pointer flex-col gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border transition-[background-color,box-shadow] hover:bg-stone-50 [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-marketing-swamp">
            <div className="flex h-full w-full items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="mr-2.5 size-[18px] text-stone-500" />
                <span className="text-left text-sm font-semibold text-stone-800">
                  Marketplace
                </span>
              </div>
              <Checkbox
                id={`${idPrefix}channel-market`}
                name={`${idPrefix}channel-type`}
                value={Channel.market}
                checked={selectedChannels.includes(Channel.market)}
                onCheckedChange={() => handleInputChange(Channel.market)}
              />
            </div>
            <p className="text-left text-xs leading-4 text-stone-500">
              List your package for sale on your Market.dev expert page
            </p>
          </div>
        </label>
      )}
    </div>
  );
}
