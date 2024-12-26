import GithubLoginButton from "../github-login-button";

// TODO: Update styling
export default async function EchoLoginPage() {
  // If echo user id is already set, redirect to onboarding or home
  //   const currentUser = await getCurrentUser();
  //   if (currentUser?.echoExpertId) {
  //     redirect("/");
  //   }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Echo + GitWallet</h1>
      <p className="text-lg text-gray-600">
        Let's get you onboarded onto GitWallet to start selling your serivces.
      </p>
      <GithubLoginButton callbackUrl="/?onboardingType=echo" />
    </div>
  );
}
