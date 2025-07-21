"use client";

import { useRef } from "react";
import { OTPInputElement } from "./otp-input-element";

interface OTPVerificationProps {
  onVerify: (code: string) => Promise<void>;
  isLoading: boolean;
  email: string;
}

export function OTPVerification({ onVerify, isLoading, email }: OTPVerificationProps) {
  const handlingVerificationRef = useRef(false);

  const handleVerification = async (verificationCode: string) => {
    if (!verificationCode || handlingVerificationRef.current || isLoading) {
      return;
    }

    handlingVerificationRef.current = true;

    try {
      await onVerify(verificationCode);
    } finally {
      handlingVerificationRef.current = false;
    }
  };

  const handleComplete = (code: string) => {
    handleVerification(code);
  };

  const handlePaste = (e: any) => {
    // Handle paste events with a slight delay to ensure the value is set
    setTimeout(() => {
      if (e.target.value) {
        handleVerification(e.target.value);
      }
    }, 0);
  };

  return (
    <div>
      <p className="block text-center text-sm text-stone-500">
        A verification code has been sent to your email. Please enter the value here.
      </p>
      <div className="mt-6 flex w-full flex-col items-center gap-4">
        <div className="w-full items-center">
          <OTPInputElement
            verifying={isLoading}
            onComplete={handleComplete}
            onInput={() => {
              // Clear any previous errors when user starts typing
            }}
            onPaste={handlePaste}
          />
        </div>
      </div>
    </div>
  );
}
