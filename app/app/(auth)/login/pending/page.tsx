import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/session-helper";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPending() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Check your email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-stone-100 p-3">
            <svg
              className="size-8 text-stone-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-stone-600">A sign-in link has been sent to your email address.</p>
          <p className="text-sm text-stone-500">
            Click the link in the email to complete your sign-in.
          </p>
          <div className="pt-4">
            <Link href="/login" className="text-sm text-stone-500 underline hover:text-stone-700">
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
