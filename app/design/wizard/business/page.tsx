import { redirect } from "next/navigation";
import OnboardingForm from "./onboarding-form";
import UserService from "@/app/services/UserService";

export default async function Business() {
  const user = await UserService.getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <OnboardingForm user={user} />;
}
