"use server";

import { redirect } from "next/navigation";
import { getRootUrl } from "@/lib/domain";

const SubscriptionSuccess = () => {
  redirect(getRootUrl("app", "/"));
};

export default SubscriptionSuccess;
