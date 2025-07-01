import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

type EmailLoginPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EmailLoginPage(props: EmailLoginPageProps) {
  const searchParams = await props.searchParams;
  const session = await getSession();

  // If the user is already logged in, redirect to the home page
  if (session && session.user) {
    redirect("/");
  }

  const { token, callbackUrl, email } = searchParams;

  // Redirect if required parameters are missing
  if (!token || !email) {
    redirect("/login?error=email-params-missing");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Complete email sign-in</CardTitle>
          <p className="text-sm text-stone-500">
            Complete your sign-in to continue to your account
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-stone-50 p-3 text-center text-sm text-stone-600">
            Signing in as: <strong>{email}</strong>
          </div>
          <form action="/api/auth/callback/email" method="get">
            <input type="hidden" name="token" value={token as string} />
            <input type="hidden" name="callbackUrl" value={callbackUrl || ""} />
            <input type="hidden" name="email" value={email as string} />
            <Button type="submit" className="w-full" size="lg">
              Continue to your account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
