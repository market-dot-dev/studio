"use client";

import useCurrentSession from "@/app/hooks/use-current-session";
import { setSignUp, userExists } from "@/app/services/registration-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UserRoundCheck } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Card } from "../ui/card";
import OTPInputElement from "./otp-input-element";

// usign a local variable to avoid state update delays

export function CustomerLoginComponent({
  redirect,
  signup = false
}: {
  redirect?: string;
  signup?: boolean;
}) {
  const handlingVerificationRef = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string>("");
  const { refreshSession, currentUser, isSignedIn } = useCurrentSession();

  const [isSignUp, setIsSignUp] = useState(signup);
  const [name, setName] = useState<string>("");

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

  const handleEmail = async (e: any) => {
    setError(null);

    if (!verificationEmail) {
      setError("Please enter your email.");
      return;
    }

    // check for email format
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(verificationEmail).toLowerCase())) {
      setError("Please enter a valid email.");
      return;
    }

    setIsSubmitting(true);

    // check if user exists
    const exists = await userExists(verificationEmail);

    if (isSignUp) {
      if (!name) {
        setError("Please enter your name.");
        setIsSubmitting(false);
        return;
      }
      try {
        const res = await setSignUp({
          email: verificationEmail,
          name
        });

        if (res === false) {
          setError("User already exists. Please sign in.");
          setIsSubmitting(false);
          setIsSignUp(false);
          return;
        }
      } catch (err) {
        console.error("Error signing up:", err);
        setError("Error signing up. Please try again.");
        setIsSubmitting(false);
        return;
      }
    } else {
      if (!exists) {
        setError("User does not exist. Please sign up.");
        setIsSubmitting(false);
        setIsSignUp(true);
        return;
      }
    }

    signIn("email", {
      email: verificationEmail,
      redirect: false
    })
      .then((res: any) => {
        if (res.ok) {
          setIsSubmitted(true);
        }
        if (res.error) {
          console.log("res", res);
          setError("Error submitting form. Please try again.");
        }
      })
      .catch((err) => {
        setError(`There was an error beginning registration. ${err}`);
        setIsSubmitted(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleVerification = async (verificationCode: string) => {
    if (!verificationEmail || !verificationCode) return;

    if (handlingVerificationRef.current || isSubmitting) return;
    handlingVerificationRef.current = true;

    setIsSubmitting(true);

    const verificationUrl = `/api/auth/callback/email?email=${encodeURIComponent(verificationEmail)}&token=${verificationCode}`;

    fetch(verificationUrl)
      .then(async (res) => {
        if (res.status === 200 || res.status === 302 || res.status === 0) {
          const callbackUrl = searchParams?.get("callbackUrl") || redirect;

          if (callbackUrl) {
            router.push(callbackUrl);
          } else {
            window.location.reload();
          }
          setError(null);
        } else {
          setError(`The code you entered is invalid. Please check your email and try again.`);
          console.log(`Error verifying code. Please try again. ${res.status}`);
          console.log(res);
        }
      })
      .catch((err) => {
        console.error("Error verifying code:", err);
        setError("Error verifying code. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
        handlingVerificationRef.current = false;
      });
  };

  const toggleSignUp = () => {
    setError(null);
    setIsSignUp(!isSignUp);
  };

  return (
    <>
      {currentUser ? (
        <Card className="flex min-h-[60px] w-full items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-start gap-3">
            <UserRoundCheck className="my-0.5 size-5 shrink-0 text-stone-500" />
            <div className="text-medium flex flex-wrap items-baseline gap-x-2 self-center text-sm font-medium tracking-tightish text-stone-500">
              <span className="text-base font-bold text-stone-800">{currentUser.name}</span>
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
      ) : !isSubmitted ? (
        <div className="flex flex-col gap-6">
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
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
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
                placeholder="Email"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={!isSignUp}
                value={verificationEmail}
                onChange={(e) => {
                  setVerificationEmail(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEmail(e);
                  }
                }}
              />
            </div>
            <div className={cn("items-center", isSignUp && "mt-2")}>
              <Button onClick={handleEmail} loading={isSubmitting} className="w-full">
                Continue
              </Button>
            </div>
          </div>
          <p className="cursor-pointer text-center text-sm text-stone-500" onClick={toggleSignUp}>
            {isSignUp ? (
              <>
                <span>Already have an account?</span>{" "}
                <Button variant="link" className="!h-fit p-0" onClick={toggleSignUp}>
                  Sign in
                </Button>
              </>
            ) : (
              <>
                <span>Don&apos;t have an account?</span>{" "}
                <Button variant="link" className="!h-fit p-0" onClick={toggleSignUp}>
                  Sign up
                </Button>
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="">
          <label className="block text-center text-sm text-stone-500">
            A verification code has been sent to your email. Please enter the value here.
          </label>
          <div className="mt-6 flex w-full flex-col items-center gap-4">
            <div className="w-full items-center">
              <OTPInputElement
                verifying={isSubmitting}
                onComplete={(code: any) => {
                  setError(null);
                  handleVerification(code);
                }}
                onInput={(e: any) => {
                  setError(null);
                }}
                onPaste={(e: any) => {
                  setTimeout(() => {
                    handleVerification(e.target.value);
                  }, 0);

                  setError(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-6 text-center text-sm">
          <p className="text-rose-500">{error}</p>
        </div>
      )}
    </>
  );
}

export default function CustomerLogin() {
  return <CustomerLoginComponent redirect="/" />;
}
