import GithubLoginButton from "../github-login-button";

// TODO: Update styling
export default async function EchoLoginPage() {
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
