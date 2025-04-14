import { Checkbox } from "@/components/ui/checkbox";
import { Channel } from "@prisma/client";
import { ShoppingBag, Store } from "lucide-react";

export default function ChannelsSelectionInput({
  selectedChannels,
  handleInputChange,
  userIsMarketExpert,
  idPrefix = ""
}: {
  selectedChannels: Channel[];
  handleInputChange: (channel: Channel) => void;
  userIsMarketExpert: boolean;
  idPrefix?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${idPrefix}channel-site`} className="block w-full">
        <div className="shadow-border-sm focus-within:ring-swamp hover:shadow-border flex size-full cursor-pointer flex-col gap-1.5 rounded bg-white p-4 pt-3.5 transition-[background-color,box-shadow] focus-within:outline-none focus-within:ring-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Store className="mr-2.5 size-[18px] text-stone-500" />
              <span className="text-left text-sm font-semibold text-stone-800">Landing Page</span>
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
        <label htmlFor={`${idPrefix}channel-market`} className="block size-full">
          <div className="shadow-border-sm focus-within:ring-swamp hover:shadow-border flex size-full cursor-pointer flex-col gap-1.5 rounded bg-white p-4 pt-3.5 transition-[background-color,box-shadow] focus-within:outline-none focus-within:ring-2">
            <div className="flex size-full items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="mr-2.5 size-[18px] text-stone-500" />
                <span className="text-left text-sm font-semibold text-stone-800">Marketplace</span>
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
              List your package for sale on your market.dev expert page
            </p>
          </div>
        </label>
      )}
    </div>
  );
}
