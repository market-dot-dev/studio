import { redirect } from "next/navigation";

export default function OnboardingPage() {
  // Redirect to the first step of onboarding - organization setup
  redirect("/onboarding/organization");
}
