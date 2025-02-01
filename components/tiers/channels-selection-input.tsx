import { Channel } from "@prisma/client";
import { Globe, Store } from "lucide-react";

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
    <div className="flex h-full gap-2">
      <label className="block w-full rounded-tremor-default focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-200">
        <div className="flex cursor-pointer flex-col gap-1 rounded-tremor-default border bg-white p-4 shadow-sm hover:bg-gray-50 [&:has(input:checked)]:border-marketing-swamp [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-marketing-swamp">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Globe className="mr-3 h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-900">Site</span>
            </div>
            <input
              type="checkbox"
              name="channel-type"
              value={Channel.site}
              className="text-gray-500 checked:text-marketing-swamp focus:outline-none focus:ring-0"
              checked={selectedChannels.includes(Channel.site)}
              onChange={() => handleInputChange(Channel.site)}
            />
          </div>
          <div className="block">
            <span className="text-xs text-gray-900">
              List your package on your website
            </span>
          </div>
        </div>
      </label>
      {userIsMarketExpert && (
        <label className="block h-full w-full rounded-tremor-default focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-200">
          <div className="flex cursor-pointer flex-col gap-1 rounded-tremor-default border bg-white p-4 shadow-sm hover:bg-gray-50 [&:has(input:checked)]:border-marketing-swamp [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-marketing-swamp">
            <div className="flex h-full w-full items-center justify-between">
              <div className="flex items-center">
                <Store className="mr-3 h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-900">Market</span>
              </div>
              <input
                type="checkbox"
                name="channel-type"
                value={Channel.market}
                className="text-gray-500 checked:text-marketing-swamp focus:outline-none focus:ring-0"
                checked={selectedChannels.includes(Channel.market)}
                onChange={() => handleInputChange(Channel.market)}
              />
            </div>
            <div className="block">
              <span className="text-xs text-gray-900">
                List your package on your Market.dev expert page
              </span>
            </div>
          </div>
        </label>
      )}
    </div>
  );
}
