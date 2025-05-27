import { Channel, Tier as TierTable } from "@/app/generated/prisma";

type Tier = TierTable;

const newTier = (tierData: Partial<Tier> = {}): Partial<Tier> => {
  return {
    name: "",
    published: false,
    price: 0,
    revision: 0,
    cadence: "month",
    channels: [Channel.site],
    ...tierData
  };
};

export { newTier };

export default Tier;
