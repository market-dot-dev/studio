import UserService from "@/app/services/UserService";
import { redirect } from "next/navigation";
import OfferingsForm from "./offerings-form";

export default async function Offerings() {
  const user = await UserService.getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <OfferingsForm user={user} />;
}
