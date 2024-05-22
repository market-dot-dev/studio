import { User, Tier, Charge as ChargeSql } from "@prisma/client"

type ChargeType = ChargeSql & { tier?: Tier; user?: User;}
export type ChargeWithUser = ChargeType & { user: User, tier?: Tier};

// TODO - Complete This Model Class