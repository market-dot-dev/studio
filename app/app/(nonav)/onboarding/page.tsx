import { redirect } from "next/navigation";

export default function OnboardingPage() {
  // Redirect to the first step of onboarding
  redirect("/onboarding/organization");
}
