import { Channel } from "@prisma/client";
import { Store, ShoppingBag } from "lucide-react";

export default function ChannelsSelectionInput({
  selectedChannels,
  handleInputChange,
  userIsMarketExpert,
}: {
  selectedChannels: Channel[];
  handleInputChange: (channel: Channel) => void;
  userIsMarketExpert: boolean;
}) {
  return (
    <div className="grid h-full gap-x-3 gap-y-2 xl:grid-cols-2">
      <label className="block w-full rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-200">
        <div className="flex h-full w-full cursor-pointer flex-col gap-2 rounded-md bg-white p-4 shadow-border hover:bg-stone-50 [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-marketing-swamp">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Store className="mr-3 h-5 w-5 text-stone-500" />
              <span className="text-left text-sm font-medium text-stone-900">
                Storefront
              </span>
            </div>
            <input
              type="checkbox"
              name="channel-type"
              value={Channel.site}
              className="rounded-sm text-stone-400 checked:text-marketing-swamp focus:outline-none focus:ring-0"
              checked={selectedChannels.includes(Channel.site)}
              onChange={() => handleInputChange(Channel.site)}
            />
          </div>
          <p className="text-left text-xs leading-4 text-stone-500">
            List your package on your website
          </p>
        </div>
      </label>
      {userIsMarketExpert && (
        <label className="block h-full w-full rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-200">
          <div className="flex h-full w-full cursor-pointer flex-col gap-2 rounded-md bg-white p-4 shadow-border hover:bg-stone-50 [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-marketing-swamp">
            <div className="flex h-full w-full items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="mr-3 h-5 w-5 text-stone-500" />
                <span className="text-left text-sm font-medium text-stone-900">
                  Marketplace
                </span>
              </div>
              <input
                type="checkbox"
                name="channel-type"
                value={Channel.market}
                className="rounded-sm text-stone-400 checked:text-marketing-swamp focus:outline-none focus:ring-0"
                checked={selectedChannels.includes(Channel.market)}
                onChange={() => handleInputChange(Channel.market)}
              />
            </div>
            <p className="text-left text-xs leading-4 text-stone-500">
              List your package on your Market.dev expert page
            </p>
          </div>
        </label>
      )}
    </div>
  );
}
