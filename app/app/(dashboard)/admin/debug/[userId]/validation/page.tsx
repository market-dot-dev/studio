"use server";

import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import ValidatorComponent from "./validator-component";
import { Suspense } from "react";

export default async function StripeDebug({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const userId = (await params).userId;
  const user = await UserService.findUser(userId);
  if (!user) {
    return <div>Not logged in</div>;
  }

  const tiers = await TierService.findByUserId(user.id);

  return (
    <Suspense>
      <ValidatorComponent user={user} tiers={tiers} />
    </Suspense>
  );
}
