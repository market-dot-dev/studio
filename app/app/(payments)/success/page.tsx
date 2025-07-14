"use server";

import { getRootUrl } from "@/lib/domain";
import { redirect } from "next/navigation";

const CheckoutSuccessPage = () => {
  redirect(getRootUrl("app", "/c"));
};

export default CheckoutSuccessPage;
