"use server";

import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import prisma from "@/lib/prisma";
import MigratorComponent from "./migrator-component";
import { Suspense } from "react";

const StripeDebug = async () => {
  const user = await UserService.getCurrentUser();
  if (!user) {
    return <div>Not logged in</div>;
  }

  const tiers = await TierService.findByUserId(user.id);
  const legacyProducts = await prisma.legacyProduct.findMany({
    include: {
      maintainer: true,
      tier: true,
      subscription: {
        include: {
          tier: true,
          user: true,
        }
      },
    }
  });

  return <Suspense>
    <MigratorComponent user={user} tiers={tiers} legacyProducts={legacyProducts} />
    </Suspense>;
};

export default StripeDebug;
