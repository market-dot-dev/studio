import { Prisma, Tier as TierTable } from "@prisma/client"

//type TierWithFeatures = Prisma.TierGetPayload<{ include: { features: true } }>
type Tier = TierTable;

const newTier = (tierData: Partial<Tier> = {}): Partial<Tier> => {
  return {
    name: '',
    published: false,
    price: 0,
    revision: 0,
    cadence: 'month',
    ...tierData,
  }
}

export { newTier }

export default Tier;