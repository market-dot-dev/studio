"use server";

import { getRootUrl } from "@/lib/domain";
import { redirect } from "next/navigation";

const SubscriptionSuccess = () => {
  redirect(getRootUrl("app", "/"));
};

export default SubscriptionSuccess;
