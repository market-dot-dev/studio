import { getSession } from "@/lib/auth";
import OnboardingService from "@/app/services/onboarding/OnboardingService";

// Get published tiers of the current admin
export async function GET() {
  const session = await getSession();

  if (!session?.user.id) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  try {
    const onboardingState = await OnboardingService.getState();
    return new Response(JSON.stringify(onboardingState), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
