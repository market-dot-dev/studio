"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";

// Define the email schema using Zod
const emailSchema = z.string().email();

export const EmailSignIn = ({ callbackUrl }: { callbackUrl: string }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(email);
      setError(""); // Clear previous error
      setLoading(true);

      await signIn("email", {
        email,
        callbackUrl
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err instanceof z.ZodError) {
        setError("Please enter a valid email address.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleEmailSignIn} className="space-y-4">
      <Input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button className="w-full" size="lg" type="submit" disabled={loading} loading={loading}>
        {loading ? "Sending email..." : "Continue with Email"}
      </Button>
    </form>
  );
};
