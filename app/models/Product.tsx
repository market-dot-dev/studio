import { Prisma, Tier as TierTable } from "@prisma/client"

//type TierWithFeatures = Prisma.TierGetPayload<{ include: { features: true } }>
//type Tier = TierTable;

type Product = {
  userId: string;
  name?: string;
  stripeProductId: string;
}

export default Product;