"use client";

import useCurrentSession from "@/app/hooks/use-current-session";
import { Button } from "@/components/ui/button";
import { getRootUrl } from "@/lib/domain";
import { UserRoundCheck } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Card } from "../ui/card";

export function CustomerLogin() {
  const { currentUser } = useCurrentSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      await signOut({ redirect: false });
      window.location.reload();
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    // Get current page URL as callback URL
    const currentUrl = window.location.href;

    // Go to login page with callback url
    const apiUrl = getRootUrl("app", "/login");
    const url = new URL(apiUrl);
    url.searchParams.set("callbackUrl", currentUrl);
    window.location.href = url.toString();
  };

  // If user is already logged in, show their info
  if (currentUser) {
    return (
      <Card className="flex min-h-[60px] w-full items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-start gap-3 overflow-auto">
          <UserRoundCheck className="my-0.5 size-5 shrink-0 text-stone-500" />
          <div className="text-medium flex flex-wrap items-baseline gap-x-2 self-center overflow-auto text-sm text-stone-500">
            <span className="text-base font-bold tracking-tightish text-stone-800">
              {currentUser.name}
            </span>
            <span className="truncate leading-6">{currentUser.email}</span>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Card>
    );
  }

  // Show login redirect button for non-authenticated users
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-sm text-stone-600">
        Please log in or create an account to complete your purchase
      </p>
      <Button onClick={handleLoginRedirect} className="w-full" size="lg">
        Login to continue
      </Button>
    </div>
  );
}
