"use server";

import TierService from "@/app/services/tier-service";
import UserService from "@/app/services/UserService";
import { Suspense } from "react";
import ValidatorComponent from "./validator-component";

const StripeDebug = async (props: { params: Promise<{ userId: string }> }) => {
  const params = await props.params;
  const user = await UserService.findUser(params.userId);
  if (!user) {
    return <div>Not logged in</div>;
  }

  const tiers = await TierService.findByUserId(user.id);

  return (
    <Suspense>
      <ValidatorComponent user={user} tiers={tiers} />
    </Suspense>
  );
};

export default StripeDebug;
