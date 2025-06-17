import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export function ExpiredBanner() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>No active plan</AlertTitle>
      <AlertDescription>Select a plan to access all features.</AlertDescription>
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
