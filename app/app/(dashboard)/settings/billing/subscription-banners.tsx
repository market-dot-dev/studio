import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface TrialBannerProps {
  daysLeft: number;
  trialEnd: Date;
}

export function TrialBanner({ daysLeft, trialEnd }: TrialBannerProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "tomorrow";
    if (diffDays > 1) return `in ${diffDays} days`;
    return "expired";
  };

  return (
    <Alert variant="default">
      <Clock className="size-4" />
      <AlertTitle>
        {daysLeft} {daysLeft === 1 ? "day" : "days"} left in trial
      </AlertTitle>
      <AlertDescription>Trial ends {formatTimeAgo(trialEnd)}</AlertDescription>
    </Alert>
  );
}

interface ExpiredBannerProps {
  isTrialExpired: boolean;
}

export function ExpiredBanner({ isTrialExpired }: ExpiredBannerProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>{isTrialExpired ? "Trial expired" : "No active plan"}</AlertTitle>
      <AlertDescription>
        {isTrialExpired
          ? "Your trial has ended. Choose a plan to continue using all features."
          : "Select a plan to access all features."}
      </AlertDescription>
    </Alert>
  );
}

interface ActiveBannerProps {
  planDisplayName: string;
}

export function ActiveBanner({ planDisplayName }: ActiveBannerProps) {
  return (
    <Alert variant="default" className="border-green-200 bg-green-50">
      <CheckCircle className="size-4 text-green-600" />
      <AlertTitle className="text-green-800">{planDisplayName} - Active</AlertTitle>
      <AlertDescription className="text-green-700">
        Manage your subscription through the customer portal below.
      </AlertDescription>
    </Alert>
  );
}
