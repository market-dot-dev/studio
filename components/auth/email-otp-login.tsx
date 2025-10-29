"use client";

import { userExists } from "@/app/services/user-service";
import { AnimatePresence, motion, Variants } from "motion/react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { EmailInput } from "./email-input";
import { OTPVerification } from "./otp-verification";

// Email validation schema
const emailSchema = z.string().email("Please enter a valid email address");

interface EmailOTPLoginProps {
  redirect?: string;
  signup?: boolean;
}

export function EmailOTPLogin({ redirect, signup = false }: EmailOTPLoginProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State management
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(signup);

  // Handle email submission
  const handleEmailSubmit = async (email: string, name?: string) => {
    setError(null);

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    // Validate email with Zod
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      setError(emailValidation.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    setVerificationEmail(email);

    try {
      // Check user existence
      const exists = await userExists(email);

      if (isSignUp) {
        if (!name) {
          setError("Please enter your name.");
          setIsLoading(false);
          return;
        }

        if (exists) {
          setError("User already exists. Please sign in.");
          setIsLoading(false);
          setIsSignUp(false);
          return;
        }
      } else {
        if (!exists) {
          setError("User does not exist. Please sign up.");
          setIsLoading(false);
          setIsSignUp(true);
          return;
        }
      }

      // Trigger OTP email via Next-Auth
      const result = await signIn("email", {
        email,
        redirect: false
      });

      if (result?.ok) {
        setIsSubmitted(true);
      } else if (result?.error) {
        setError("Error submitting form. Please try again.");
      }
    } catch (err) {
      console.error("Error in email submission:", err);
      setError("There was an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOTPVerification = async (verificationCode: string) => {
    if (!verificationEmail || !verificationCode) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call Next-Auth callback endpoint directly
      const verificationUrl = `/api/auth/callback/email?email=${encodeURIComponent(verificationEmail)}&token=${verificationCode}`;

      const response = await fetch(verificationUrl);

      if (response.status === 200 || response.status === 302 || response.status === 0) {
        // Success - handle redirect
        const callbackUrl = searchParams?.get("callbackUrl") || redirect;

        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          window.location.reload();
        }
      } else {
        setError("The code you entered is invalid. Please check your email and try again.");
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setError("Error verifying code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup/signin toggle
  const handleToggleSignUp = () => {
    setError(null);
    setIsSignUp(!isSignUp);
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {!isSubmitted ? (
          <motion.div
            key="email-input"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="flex flex-col gap-6"
          >
            <EmailInput
              onSubmit={handleEmailSubmit}
              isLoading={isLoading}
              isSignUp={isSignUp}
              onToggleSignUp={handleToggleSignUp}
              error={error}
            />
          </motion.div>
        ) : (
          <motion.div
            key="otp-verification"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <OTPVerification
              onVerify={handleOTPVerification}
              isLoading={isLoading}
              email={verificationEmail}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="mt-6 text-center text-sm"
        >
          <p className="text-destructive">{error}</p>
        </motion.div>
      )}
    </>
  );
}
