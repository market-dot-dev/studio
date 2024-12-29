"use client";

import { useState } from "react";
import EchoConnectionForm from "./echo-connection-form";
import { User } from "@prisma/client";
import { Site } from "@prisma/client";
import EchoProfileForm from "./echo-profile-form";

export default function EchoOnboardingForm({
  user,
  currentSite,
  onComplete,
}: {
  user: User;
  currentSite?: Site;
  onComplete: () => void;
}) {
  console.log("Enters echo onboarding form");
  console.log("echoExpertId", user.echoExpertId);
  const [step, setStep] = useState<"echo-connection" | "echo-profile">(
    user.echoExpertId ? "echo-profile" : "echo-connection",
  );

  return (
    <div className="flex w-full items-center justify-center">
      {step === "echo-connection" ? (
        <EchoConnectionForm onComplete={() => setStep("echo-profile")} />
      ) : (
        <EchoProfileForm
          user={user}
          currentSite={currentSite}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}
