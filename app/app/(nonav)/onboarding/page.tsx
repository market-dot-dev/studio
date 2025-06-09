import { redirect } from "next/navigation";

export default function OnboardingPage() {
  // Redirect to the first step of onboarding - business description for tier generation
  redirect("/onboarding/business-description");
}
