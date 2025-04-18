"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function UserAnalyticsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const period = searchParams.get("period") || "30days";

  const handlePeriodChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("period", value);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Time period:</span>
      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="60days">Last 60 days</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
