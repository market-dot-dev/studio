"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface EmailInputProps {
  onSubmit: (email: string, name?: string) => Promise<void>;
  isLoading: boolean;
  isSignUp: boolean;
  onToggleSignUp: () => void;
  error?: string | null;
}

export function EmailInput({
  onSubmit,
  isLoading,
  isSignUp,
  onToggleSignUp,
  error
}: EmailInputProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    await onSubmit(email, isSignUp ? name : undefined);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {isSignUp && (
        <div>
          <Label htmlFor="name" className="mb-2">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
            autoFocus
            disabled={isLoading}
          />
        </div>
      )}

      <div className="w-full items-center">
        {isSignUp && (
          <Label htmlFor="email" className="mb-2">
            Email
          </Label>
        )}
        <Input
          id="email"
          type="email"
          placeholder="Email"
          autoFocus={!isSignUp}
          value={email}
          onChange={handleEmailChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className={error ? "border-red-500" : ""}
        />
      </div>

      <div className={cn("items-center", isSignUp && "mt-2")}>
        <Button
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading || !email || (isSignUp && !name)}
          className="w-full"
        >
          Continue
        </Button>
      </div>

      <p className="text-center text-sm text-stone-500">
        {isSignUp ? (
          <>
            <span>Already have an account?</span>{" "}
            <Button variant="link" onClick={onToggleSignUp} disabled={isLoading}>
              Sign in
            </Button>
          </>
        ) : (
          <>
            <span>Don&apos;t have an account?</span>{" "}
            <Button variant="link" onClick={onToggleSignUp} disabled={isLoading}>
              Sign up
            </Button>
          </>
        )}
      </p>
    </div>
  );
}
