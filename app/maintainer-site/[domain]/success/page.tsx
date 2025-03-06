"use server";

import { getRootUrl } from "@/lib/domain";
/*
import PageHeading from '@/components/common/page-heading';
*/
import { redirect } from "next/navigation";

const SubscriptionSuccess = () => {
  redirect(getRootUrl("app", "/"));
};

export default SubscriptionSuccess;
