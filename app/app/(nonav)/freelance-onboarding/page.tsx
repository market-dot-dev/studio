"use client";

import { ConnectStripeScreen } from "@/components/freelance-onboarding/connect-stripe-screen";
import { CreateOfferingsScreen } from "@/components/freelance-onboarding/create-offerings-screen";
import { FinishedScreen } from "@/components/freelance-onboarding/finished-screen";
import { InviteTeammatesScreen } from "@/components/freelance-onboarding/invite-teammates-screen";
import { useState } from "react";

export default function FreelanceOnboardingPage() {
  const [currentScreen, setCurrentScreen] = useState<
    "offerings" | "stripe" | "teammates" | "finished"
  >("offerings");
  const [offeringsData, setOfferingsData] = useState<any>(null);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [invitedTeammates, setInvitedTeammates] = useState<any[]>([]);

  const handleOfferingsComplete = (data: any) => {
    setOfferingsData(data);
    setCurrentScreen("stripe");
  };

  const handleStripeComplete = (connected: boolean) => {
    setStripeConnected(connected);
    setCurrentScreen("teammates");
  };

  const handleTeammatesComplete = (invited: any[]) => {
    setInvitedTeammates(invited);
    setCurrentScreen("finished");
  };

  const handleFinished = () => {
    // Redirect to dashboard
    window.location.href = "/app";
  };

  const handleBack = () => {
    if (currentScreen === "stripe") {
      setCurrentScreen("offerings");
    } else if (currentScreen === "teammates") {
      setCurrentScreen("stripe");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-stone-100">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative mx-auto max-w-xl px-4 py-8">
        {currentScreen === "offerings" && (
          <CreateOfferingsScreen onComplete={handleOfferingsComplete} />
        )}
        {currentScreen === "stripe" && (
          <ConnectStripeScreen
            onComplete={handleStripeComplete}
            onBack={handleBack}
            isConnected={stripeConnected}
          />
        )}
        {currentScreen === "teammates" && (
          <InviteTeammatesScreen onFinish={handleTeammatesComplete} onBack={handleBack} />
        )}
        {currentScreen === "finished" && <FinishedScreen onGoToDashboard={handleFinished} />}
      </div>
    </div>
  );
}
