"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LocalAuthButton() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const callbackUrl = searchParams?.get("callbackUrl");

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Use signIn with the provided gh username and password
    const res = await signIn("credentials", {
      redirect: false,
      gh_username: username,
      password,
    });

    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
    } else {
      // Redirect to callbackUrl if available, otherwise to home
      if (callbackUrl) {
        window.location.href = callbackUrl;
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">
          GitHub Username
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          required
          className="w-full"
          placeholder="Enter any GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="w-full"
          placeholder="Enter the local auth password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading} loading={loading} className="w-full">
        Sign in with Local Auth
      </Button>
    </form>
  );
}
