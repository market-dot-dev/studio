"use server";

import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import ValidatorComponent from "./validator-component";
import { Suspense } from "react";

const StripeDebug = async ({ params }: { params: { userId: string } }) => {
  const user = await UserService.findUser(params.userId);
  if (!user) {
    return <div>Not logged in</div>;
  }

  const tiers = await TierService.findByUserId(user.id);

  return <Suspense>
    <ValidatorComponent user={user} tiers={tiers} />
    </Suspense>;
};

export default StripeDebug;
