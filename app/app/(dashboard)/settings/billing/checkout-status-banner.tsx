"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function CheckoutStatusBanner() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  if (!status) return null;

  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: <CheckCircle className="size-5" />,
          message: "Your subscription has been successfully updated!",
          className: "bg-green-50 text-green-800 border-green-200"
        };
      case "cancelled":
        return {
          icon: <XCircle className="size-5" />,
          message: "The checkout process was cancelled. No changes were made to your subscription.",
          className: "bg-yellow-50 text-yellow-800 border-yellow-200"
        };
      case "error":
        return {
          icon: <AlertCircle className="size-5" />,
          message:
            "There was an error processing your subscription. Please try again or contact support if the problem persists.",
          className: "bg-red-50 text-red-800 border-red-200"
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <Card className={`mb-4 ${config.className}`}>
      <CardContent className="flex flex-row items-center gap-2 py-3">
        {config.icon}
        <p>{config.message}</p>
      </CardContent>
    </Card>
  );
}
